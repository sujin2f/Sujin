/* Models */
import Mongo from '@common/data/mongo/mongo'
import Cached from '@common/model/Cached'
import Logger from '@common/model/Logger'
/* Types */
import type { ArchiveType, CategoryType } from '@app/_lib/data/mysql/types'
import type { MutationResultType } from '@app/api/graphql/constants'
/* CONSTANTS */
// import { WEEK_IN_SECONDS } from '@common/constants/datetime'
import { IS_DEV } from '@common/constants/helper'
import { PER_PAGE } from '@app/_lib/data/mysql/constants'
import {
    ARCHIVE,
    COLLECTION,
    IMAGE_SIZE_BACKGROUND,
    T_ImageBlock,
} from '@app/_lib/types'
/* Utils */
import { getArchiveBySlug as getMySQLArchive } from '@app/_lib/data/mysql/term'
import { getCacheKey } from '@app/_lib/utils'
import { removeOption, getOption } from '@app/_lib/data/mysql/option'
import { convertImageBlockURL } from '@app/_lib/data/mysql/utils'
import { formatImageBlock } from '@app/_lib/data/mongo/wordpress/util'
import { ERROR_MESSAGE, ServerError } from '@app/_lib/constants-error'

export const categoryFormatter = (
    term: Record<string, unknown>,
): CategoryType => {
    const formatted = {
        id: term.id,
        title: term.title,
        slug: term.slug,
        excerpt: term.excerpt,
        total: term.total || 0,
    } as CategoryType

    if (term.image) {
        formatted.image = formatImageBlock(
            term.image as T_ImageBlock,
            IMAGE_SIZE_BACKGROUND,
        )
    }

    return formatted
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
    formatter: (term: Record<string, unknown>) => T,
): Promise<T> =>
    await Cached.getInstance().getOrExecute<T>(
        getCacheKey(type, slug),
        async () =>
            await getArchive<T>(slug, type, formatter)
                .then(async (archive) => {
                    const total = await updateTotal(archive.slug, type)
                    return formatter({ ...archive, total })
                })
                .catch(
                    async () => await updateArchive<T>(slug, type, formatter),
                ),
        0,
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
    formatter: (term: Record<string, unknown>) => T,
): Promise<T> =>
    await Mongo.findOne(type, { slug }).then(
        (term) => formatter(term) as unknown as T,
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
const updateTotal = async (slug: string, type: ARCHIVE): Promise<number> =>
    await getTotal(slug, type).then(async (total) => {
        await Mongo.updateOne(type, { slug }, { $set: { total } })
        return total
    })

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
    formatter: (term: Record<string, unknown>) => T,
): Promise<T> => {
    await Cached.getInstance().flush(getCacheKey(type, slug))
    const table = type

    const wp = await getMySQLArchive(slug, type)
    const mongo = await Mongo.findOne(table, {
        slug,
    }).catch(() => null)
    const term = {
        ...wp,
        image: wp.image ? convertImageBlockURL(wp.image) : undefined,
        total: await getTotal(slug, type).catch(() => 0),
    }

    if (type === ARCHIVE.TAG && 'hits' in term) {
        term.hits = (mongo && 'hits' in mongo && mongo.hits) || 0
    }

    const formatted = formatter(term)
    await Mongo.insertOrReplace<ArchiveType>(table, { slug }, formatted)
    await Cached.getInstance().set(getCacheKey(type, slug), formatted)
    return formatted as unknown as T
}

/**
 * Updates an archive from MySQL and clears associated cache.
 *
 * @param {string} nonce - The nonce value used to validate the update request.
 * @param {string} slug - The ID of the term.
 * @returns {Promise<MutationResultType>} An object indicating the result of the operation.
 * @throws {Error} Throws an error if the nonce value is invalid.
 */
export const mutateArchive = async <T extends ArchiveType>(
    nonce: string,
    slug: string,
    type: ARCHIVE,
    formatter: (term: Record<string, unknown>) => T,
): Promise<MutationResultType> => {
    const optionKey = `update_term_${nonce}`
    const nonceValue = await getOption(optionKey)
    await removeOption(optionKey)

    // Nonce validation
    if (`${nonce}-${slug}` !== nonceValue) {
        throw new ServerError(
            ERROR_MESSAGE.GENERAL.NONCE_FAILED,
            'mutateArchive()',
        )
    }

    await updateArchive<T>(slug, type, formatter)
    Logger.server(`Updated MongoDB ${type}: ${slug}`)
    return {
        result: true,
    }
}

export const getArchives = async <T extends ArchiveType>(
    page: number = 1,
    type: ARCHIVE,
    formatter: (term: Record<string, unknown>) => T,
) =>
    await Mongo.findMany<T>(
        type,
        {},
        { limit: PER_PAGE, skip: PER_PAGE * (page - 1) },
    ).then((terms) => terms.map((term) => formatter(term)))

export const removeArchive = async (slug: string, type: ARCHIVE) => {
    await Cached.getInstance().flush(getCacheKey(type, slug))
    await Mongo.deleteOne(type, { slug })
}
