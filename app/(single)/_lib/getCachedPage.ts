import sanitize from 'mongo-sanitize'
/* CONSTANTS */
import { COLLECTION, type T_Page } from '@app/_lib/types'
/* Utils */
import { findOne } from '@common/data/mongo/mongo'
import { cachedRequest } from '@app/_lib/utils/cache'
/* T_Types */
import type { T_Stringify } from '@common/types/mongo'
import { DatabaseError, NoContentError } from '@common/model/Error'

/**
 * Get single page by slug
 * This returns the cached result if it exists
 *
 * @param {string} _slug - Post slug
 * @returns {Promise<T_Page>} - The post object
 */
export const getCachedPage = async (
    _slug: string,
): Promise<T_Stringify<T_Page>> => {
    const slug = sanitize(_slug)
    let error: Error | null = null
    const page = await cachedRequest(
        COLLECTION.PAGE,
        [slug],
        async () =>
            await findOne<T_Page>(COLLECTION.PAGE, { slug })
                .then(
                    (post) =>
                        ({
                            ...post,
                            _id: post._id.toString(),
                        } satisfies T_Stringify<T_Page>),
                )
                .catch((e) => {
                    // Failed to find the post, cache false
                    error =
                        e instanceof DatabaseError
                            ? new NoContentError(
                                  `Could not find the page ${slug}`,
                              ).setCause(e)
                            : e
                    return false
                }),
    )
    if (error) {
        throw error
    }
    return page as T_Stringify<T_Page>
}
