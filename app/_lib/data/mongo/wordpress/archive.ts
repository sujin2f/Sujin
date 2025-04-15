/* Models */
import Cached from '@common/model/Cached'
/* T_Types */
import type { MutationResultType } from '@app/api/graphql/constants'
/* CONSTANTS */
import { IS_DEV } from '@common/constants/helper'
import { PER_PAGE } from '@app/_lib/data/mysql/constants'
import { ARCHIVE, COLLECTION, POST_STATUS, T_Archive } from '@app/_lib/types'
import { DAY_IN_SECONDS } from '@common/constants/datetime'
import { default as schema } from '@app/_lib/data/mongo/schema/10.3.3'
/* Utils */
import { getArchiveBySlug as getMySQLArchive } from '@app/_lib/data/mysql/term'
import { getCacheKey } from '@app/_lib/utils'
import { auth } from '@app/_lib/utils-server'
import { getCollection, insertOrReplace } from '@common/data/mongo/mongo'
import { ObjectId, WithId } from 'mongodb'
import { schemaFormatter } from '@common/utils/object'
import { convertImageBlockURL } from '@app/_lib/data/mysql/utils'

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
 * @param {number} page If exist, return with posts
 * @returns {Promise<T_Archive>}
 */
export const getCachedArchive = async (
    slug: string,
    type: ARCHIVE,
): Promise<WithId<T_Archive> | null> =>
    await Cached.getInstance().getOrExecute<WithId<T_Archive> | null>(
        getCacheKey(COLLECTION.ARCHIVE, type, slug),
        async () => {
            const collection = await getCollection<T_Archive>(
                COLLECTION.ARCHIVE,
            )
            return await collection.findOne({ slug, type })
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
): Promise<ObjectId> => {
    await auth(nonce, slug)

    await Cached.getInstance().flush(
        getCacheKey(COLLECTION.ARCHIVE, type, slug),
    )

    const wp = await getMySQLArchive(slug, type)
    if (wp.image) {
        wp.image = convertImageBlockURL(wp.image)
    }

    return await insertOrReplace<T_Archive>(
        COLLECTION.ARCHIVE,
        { slug, type },
        formatter({ ...wp, type, total: 0, hits: 0 }),
    )
}

/**
 * Updates an archive from MySQL and clears associated cache.
 *
 * @param {string} nonce - The nonce value used to validate the update request.
 * @param {string} slug - The ID of the term.
 * @returns {Promise<MutationResultType>} An object indicating the result of the operation.
 * @throws {Error} Throws an error if the nonce value is invalid.
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

export const getArchives = async (type: ARCHIVE, page: number = 1) => {
    const collection = await getCollection<T_Archive>(COLLECTION.ARCHIVE)
    return await collection
        .find({ type })
        .limit(PER_PAGE)
        .skip(PER_PAGE * (page - 1))
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
