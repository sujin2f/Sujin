/* Models */
import Mongo from '@common/data/mongo/mongo'
import Cached from '@common/model/Cached'
import Logger from '@common/model/Logger'
/* Types */
import type { ArchiveType, TermType } from '@app/_lib/data/mysql/types'
import type { MutationResultType } from '@app/api/graphql/constants'
/* CONSTANTS */
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
import { IS_DEV } from '@common/constants/helper'
import { PER_PAGE } from '@app/_lib/data/mysql/constants'
import { ARCHIVE, COLLECTION } from '@app/_lib/types'
/* Utils */
import { getArchiveBySlug as getMySQLArchive } from '@app/_lib/data/mysql/term'
import { getCacheKey } from '@app/_lib/utils'
import { removeOption, getOption } from '@app/_lib/data/mysql/option'
import { convertImageBlockURL } from '@app/_lib/data/mysql/utils'
import { formatImageBlock } from '@app/_lib/data/mongo/wordpress/util'

const format = <T extends ArchiveType>(
    term: Record<string, unknown>,
    type: ARCHIVE,
): T => {
    const formatted: Record<string, unknown> = {
        id: term.id,
        title: term.title,
        slug: term.slug,
        excerpt: term.excerpt,
        image: formatImageBlock(term.image as Record<string, unknown>),
        total: term.total || 0,
    }

    if (type === ARCHIVE.TAG) {
        formatted.hits = term.hits
    }

    return formatted as T
}

/**
 * Get archive by slug
 *
 * @template {T} ArchiveType
 * @param {string} slug
 * @param {ARCHIVE} type
 * @returns {Promise<ArchiveType>}
 */
export const getCachedArchive = async <T extends ArchiveType>(
    slug: string,
    type: ARCHIVE,
): Promise<T> =>
    await Cached.getInstance().getOrExecute<T>(
        getCacheKey(type, slug),
        async () =>
            await getArchive(slug, type)
                .then(async (archive) => {
                    const total = await updateTotal(archive.slug, type)
                    return format<T>({ ...archive, total }, type)
                })
                .catch(async () => await updateArchive(slug, type)),
        WEEK_IN_SECONDS,
        IS_DEV,
    )

/**
 * Get archive by slug
 *
 * @param {string} slug
 * @param {ARCHIVE} type
 * @returns {Promise<ArchiveType>}
 */
const getArchive = async <T extends ArchiveType>(
    slug: string,
    type: ARCHIVE,
): Promise<T> =>
    await Mongo.findOne<ArchiveType>(type, { slug }).then((term) =>
        format<T>(term, type),
    )

/**
 * Get how many posts are in the archive
 *
 * @param {string} slug
 * @param {ARCHIVE} type
 * @returns {Promise<number>}
 */
const getTotal = async (slug: string, type: ARCHIVE): Promise<number> =>
    await Mongo.count(COLLECTION.POST, {
        terms: { $elemMatch: { slug, type } },
    })

/**
 * Update post count
 *
 * @param {string} slug
 * @param {ARCHIVE} type
 */
const updateTotal = async (slug: string, type: ARCHIVE) => {
    await getTotal(slug, type).then(
        async (total) =>
            await Mongo.updateOne<TermType>(
                type,
                { slug },
                { $set: { total } },
            ),
    )
}

/**
 * Update archive from WP
 *
 * @param {string} slug
 * @param {ARCHIVE} type
 * @returns {Promise<ArchiveType>} updated archive
 */
export const updateArchive = async <T extends ArchiveType>(
    slug: string,
    type: ARCHIVE,
): Promise<T> => {
    await Cached.getInstance().flush(getCacheKey(type, slug))
    const table = type

    const wp = await getMySQLArchive(slug, type).catch(async () => {
        await removeArchive(slug, type)
        // Remove tag cloud cache
        await Cached.getInstance().flush(getCacheKey(ARCHIVE.TAG, 'tag-cloud'))
        const message = `updateArchive(): Cannot find term from MySQL ${slug}, ${type}`
        Logger.server(message)
        throw Error(message)
    })

    const mongo = await Mongo.findOne<ArchiveType>(table, {
        slug,
    }).catch(() => null)

    const term: Record<string, unknown> = {
        ...wp,
        image: wp.image ? convertImageBlockURL(wp.image) : undefined,
        total: await getTotal(slug, type).catch(() => 0),
    }

    if (type === ARCHIVE.TAG) {
        term.hits = (mongo && 'hits' in mongo && mongo.hits) || 0
    }
    const formatted = format<T>(term, type)

    await Mongo.findOne<ArchiveType>(table, { slug })
        .then(async () => {
            await Mongo.replaceOne<ArchiveType>(
                table,
                { slug },
                formatted,
            ).catch((e) => {
                const message = 'updateArchive(): Mongo.replaceOne failed'
                Logger.server(message, formatted)
                throw e
            })
        })
        .catch(async () => {
            await Mongo.insertOne<ArchiveType>(table, formatted).catch((e) => {
                const message = 'updateArchive(): Mongo.insertOne failed'
                Logger.server(message, formatted)
                throw e
            })
        })
    return formatted
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

export const getArchives = async <T extends ArchiveType>(
    page: number = 1,
    type: ARCHIVE,
) =>
    await Mongo.findMany<T>(
        type,
        {},
        { limit: PER_PAGE, skip: PER_PAGE * (page - 1) },
    ).then((terms) => terms.map((term) => format(term, type)))

export const removeArchive = async (slug: string, type: ARCHIVE) => {
    await Cached.getInstance().flush(getCacheKey(type, slug))
    await Mongo.deleteOne(type, { slug })
}
