import { WithId } from 'mongodb'
/* Models */
import Mongo from '@common/data/mongo/mongo'
import Cached from '@common/model/Cached'
import Logger from '@common/model/Logger'
/* Types */
import type { ARCHIVE, ArchiveType } from '@app/_lib/data/mysql/types'
import type { MutationResultType } from '@app/api/graphql/constants'
/* Constants */
import { COLLECTION } from '@app/_lib/data/mongo/constants'
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
import { IS_DEV } from '@common/constants/helper'
import { PER_PAGE } from '@app/_lib/data/mysql/constants'
/* Utils */
import { getArchiveBySlug as getMySQLArchiveBySlug } from '@app/_lib/data/mysql/term'
import { getCacheKey } from '@app/_lib/utils'
import { removeOption, getOption } from '@app/_lib/data/mysql/option'

export const format = (
    term: WithId<ArchiveType> | ArchiveType,
): ArchiveType => {
    const formatted: ArchiveType = {
        id: term.id,
        title: term.title,
        slug: term.slug,
        excerpt: term.excerpt,
        total: term.total,
        hits: term.hits,
    }
    if (term.image) {
        formatted.image = term.image
    }
    return formatted
}

/**
 * Get archive by slug
 *
 * @param {string} slug
 * @returns {Promise<ArchiveType>}
 */
export const getCachedArchive = async (
    slug: string,
    type: ARCHIVE,
    updateFromMySQL: boolean = false,
): Promise<ArchiveType> => {
    const key = getCacheKey(type, slug)

    return await Cached.getInstance().getOrExecute(
        key,
        async () => {
            const term = await getArchiveBySlug(slug, type).catch(async () => {
                if (updateFromMySQL) {
                    return await updateArchive(slug, type)
                }
                const message = `getArchiveBySlug(): Cannot find term from MongoDB ${slug}, ${type}`
                Logger.server(message)
                throw Error(message)
            })
            return format(term)
        },
        WEEK_IN_SECONDS,
        IS_DEV,
    )
}

/**
 * Get archive by slug
 * If there's no term from DB, use mySQL
 *
 * @param {string} slug
 * @returns {Promise<ArchiveType>}
 */
const getArchiveBySlug = async (
    slug: string,
    type: ARCHIVE,
): Promise<ArchiveType> =>
    await Mongo.findOne<ArchiveType>(type, { slug }).then((term) =>
        format(term),
    )

/**
 * Get how many posts are in the archive
 *
 * @param {string} slug
 * @returns {Promise<[ArchiveType, number]>}
 */
const getTotalPosts = async (
    slug: string,
    type: ARCHIVE,
): Promise<[ArchiveType, number]> =>
    await Mongo.findOne<ArchiveType>(type, { slug }).then(async (term) => {
        const total = await Mongo.count(COLLECTION.POST, {
            'terms.id': term.id,
        })
        return [format({ ...term, slug }), total]
    })

/**
 * Update post count
 *
 * @param {string} slug
 * @returns {Promise<ArchiveType>}
 */
export const updateArchiveTotal = async (
    slug: string,
    type: ARCHIVE,
): Promise<ArchiveType> => {
    await Cached.getInstance().flush(getCacheKey(type, slug))
    const [term, total] = await getTotalPosts(slug, type)
    const update = format({
        ...term,
        total,
    })
    await Mongo.replaceOne<ArchiveType>(type, { slug }, update)
    return update
}

/**
 * Update archive from WP
 *
 * @param {string} slug
 * @returns {Promise<ArchiveType>}
 */
export const updateArchive = async (
    slug: string,
    type: ARCHIVE,
): Promise<ArchiveType> => {
    await Cached.getInstance().flush(getCacheKey(type, slug))

    return await getMySQLArchiveBySlug(slug, type)
        .then(
            async (wp) =>
                await Mongo.findOne<ArchiveType>(type, {
                    slug,
                })
                    .then(async (mongo) => {
                        const [, total] = await getTotalPosts(slug, type).catch(
                            () => [, 0] satisfies [undefined, number],
                        )
                        const term = format({
                            ...wp,
                            total,
                            hits: mongo.hits,
                            slug,
                        })
                        await Mongo.replaceOne(type, { slug }, term)
                        return term
                    })
                    .catch(async () => {
                        const [, total] = await getTotalPosts(slug, type).catch(
                            () => [, 0] satisfies [undefined, number],
                        )
                        const term = format({
                            ...wp,
                            total,
                            slug,
                            hits: 0,
                        })
                        await Mongo.insertOne(type, term)
                        return term
                    }),
        )
        .catch(async () => {
            await removeArchive(slug, type)
            const message = `updateArchive(): Cannot find term from MySQL ${slug}, ${type}`
            Logger.server(message)
            throw Error(message)
        })
}

/**
 * Updates an archive from MySQL and clears associated cache.
 *
 * @param {string} nonce - The nonce value used to validate the update request.
 * @param {string} slug - The ID of the term.
 * @returns {Promise<MutationResultType>} An object indicating the result of the operation.
 * @throws {Error} Throws an error if the nonce value is invalid.
 */
export const secureUpdateArchive = async (
    nonce: string,
    slug: string,
    type: ARCHIVE,
): Promise<MutationResultType> => {
    const optionKey = `update_term_${nonce}`
    const nonceValue = await getOption(optionKey)
    await removeOption(optionKey)

    // Nonce validation
    if (`${nonce}-${slug}` !== nonceValue) {
        const message = 'secureUpdateTerm got invalid nonce.'
        Logger.server(message)
        throw Error(message)
    }

    await updateArchive(slug, type)

    Logger.server(`Updated MongoDB ${type}: ${slug}`)
    return {
        result: true,
    }
}

export const getArchives = async (page: number = 1, type: ARCHIVE) =>
    await Mongo.findMany<ArchiveType>(
        type,
        {},
        { limit: PER_PAGE, skip: PER_PAGE * (page - 1) },
    ).then((terms) => terms.map((term) => format(term)))

export const removeArchive = async (slug: string, type: ARCHIVE) => {
    await Cached.getInstance().flush(getCacheKey(type, slug))
    await Mongo.deleteOne(type, { slug })
}
