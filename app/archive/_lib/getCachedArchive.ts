'use server'
import sanitize from 'mongo-sanitize'
/* Models */
import { A_Error, NoContentError } from '@common/model/Error'
/* CONSTANTS */
import { ARCHIVE, COLLECTION, T_Archive } from '@app/_lib/types'
/* Utils */
import { findOne } from '@common/data/mongo/mongo'
import { cachedRequest } from '@app/_lib/utils/cache'

/**
 * Get archive by slug
 *
 * @template {T} T_Archive
 * @param {string} _slug
 * @param {ARCHIVE} _type
 * @returns {Promise<T_Archive>}
 */
export const getCachedArchive = async (
    _slug: string,
    _type: ARCHIVE,
): Promise<T_Archive> => {
    const slug = sanitize(_slug)
    const type = sanitize(_type)
    let error: Error | null = null

    const archive = await cachedRequest(
        COLLECTION.ARCHIVE,
        [type, slug],
        async () =>
            await findOne<T_Archive>(COLLECTION.ARCHIVE, { slug, type })
                .then((archive) => {
                    if (!archive.total) {
                        // Failed to find the post, cache false
                        error = new NoContentError(
                            'Archive is empty.',
                            slug,
                            type,
                        )
                        return false
                    }
                    return archive
                })
                .catch((e) => {
                    // Failed to find the post, cache false
                    error =
                        e instanceof A_Error
                            ? new NoContentError(
                                  'Archive cannot be found.',
                                  slug,
                                  type,
                              ).setCause(e)
                            : e
                    return false
                }),
    )
    if (error) {
        throw error
    }

    return archive as T_Archive
}
