import { ObjectId } from 'mongodb'
/* Models */
import Cached from '@common/model/Cached'
/* T_Types */
import type { MutationResultType } from '@app/api/graphql/constants'
/* CONSTANTS */
import { IS_DEV } from '@common/constants/helper'
import { ARCHIVE, COLLECTION, POST_STATUS, T_Archive } from '@app/_lib/types'
import { DAY_IN_SECONDS } from '@common/constants/datetime'
import { default as schema } from '@app/_lib/data/mongo/schema/10.3.4'
/* Utils */
import { getArchiveBySlug as getMySQLArchive } from '@app/_lib/data/mysql/term'
import { getCacheKey } from '@app/_lib/utils'
import { auth } from '@app/_lib/data/mongo/user'
import {
    findOne,
    getCollection,
    insertOrReplace,
} from '@common/data/mongo/mongo'
import { schemaFormatter } from '@common/utils/object'
import { convertImageBlockURL } from '@app/_lib/data/mysql/utils'
import { getAggregation } from '@app/_lib/utils-server'

export const formatter = (term: Record<string, unknown>): T_Archive => {
    const formatted = schemaFormatter(term, schema.archive) as T_Archive
    return formatted
}

/**
 * Get archive by slug
 *
 * @template {T} T_Archive
 * @param {string} slug
 * @param {ARCHIVE} type
 * @returns {Promise<T_Archive>}
 */
export const getCachedArchive = async (
    slug: string,
    type: ARCHIVE,
): Promise<T_Archive> =>
    await Cached.getInstance().getOrExecute<T_Archive>(
        getCacheKey(COLLECTION.ARCHIVE, type, slug),
        async () => {
            return await findOne<T_Archive>(COLLECTION.ARCHIVE, { slug, type })
        },
        DAY_IN_SECONDS,
        IS_DEV,
    )

/**
 * Update archive from WP
 *
 * @param {string} slug
 * @param {ARCHIVE} type
 * @returns {Promise<T_Archive>} updated archive
 */
export const updateArchive = async (
    slug: string,
    type: ARCHIVE,
    nonce?: string,
): Promise<void> => {
    await auth(nonce, slug)

    await Cached.getInstance().flush(
        getCacheKey(COLLECTION.ARCHIVE, type, slug),
    )

    const wp = await getMySQLArchive(slug)
    if (wp.image) {
        wp.image = convertImageBlockURL(wp.image)
    }

    const result = await insertOrReplace<T_Archive>(
        COLLECTION.ARCHIVE,
        { slug, type },
        formatter({ ...wp, type, total: 0, hits: 0 }),
    )

    await updateTotal([result])
}

/**
 * Updates an archive from MySQL and clears associated cache.
 *
 * @param {string} nonce - The nonce value used to validate the update request.
 * @param {string} slug - The ID of the term.
 * @returns {Promise<MutationResultType>} An object indicating the result of the operation.
 */
export const mutateArchive = async (
    nonce: string,
    slug: string,
    type: ARCHIVE,
): Promise<MutationResultType> => {
    await updateArchive(slug, type, nonce)
    return {
        result: true,
    }
}

export const getArchives = async (
    type: ARCHIVE,
    page: number = 1,
): Promise<T_Archive[]> => {
    const collection = await getCollection<T_Archive>(COLLECTION.ARCHIVE)
    return await collection
        .aggregate<T_Archive>([
            {
                $match: { type },
            },
            ...getAggregation('paging', page),
            ...getAggregation('_id'),
        ])
        .toArray()
}

export const removeArchive = async (slug: string, type: ARCHIVE) => {
    await auth()
    await Cached.getInstance().flush(
        getCacheKey(COLLECTION.ARCHIVE, type, slug),
    )
    const collection = await getCollection<T_Archive>(COLLECTION.ARCHIVE)
    return await collection.deleteOne({ slug, type })
}

export const updateTotal = async (_ids: ObjectId[]) => {
    const post = await getCollection(COLLECTION.POST)
    const archive = await getCollection(COLLECTION.ARCHIVE)

    for (const _id of Array.from(new Set(_ids))) {
        const total = await post.countDocuments({
            archives: new ObjectId(_id),
            status: POST_STATUS.PUBLISH,
        })
        await archive.updateOne({ _id }, { $set: { total } })
    }
}
