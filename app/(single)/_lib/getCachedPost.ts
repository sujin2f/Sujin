import sanitize from 'mongo-sanitize'
/* Models */
import { NoContentError } from '@common/model/Error'
/* Utils */
import { getCollection } from '@common/data/mongo/mongo'
import { getAggregation } from '@app/_lib/utils/server'
import { cachedRequest } from '@app/_lib/utils/cache'
/* CONSTANTS */
import { COLLECTION, type T_Post } from '@app/_lib/types'
/* T_Types */
import type { T_Stringify } from '@common/types/mongo'

/**
 * Get single post by slug
 * This returns the cached result if it exists
 *
 * @param {string} _slug - Post slug
 * @throws {NoContentError}
 */
export const getCachedPost = async (
    _slug: string,
): Promise<T_Stringify<T_Post, 'archives'>> => {
    const slug = sanitize(_slug)
    const post = await cachedRequest(COLLECTION.POST, [slug], async () => {
        const collection = await getCollection<T_Post>(COLLECTION.POST)
        const posts = await collection
            .aggregate<T_Stringify<T_Post, 'archives'>>([
                { $match: { slug } },
                ...getAggregation('_id'),
                ...getAggregation('expand-archive'),
            ])
            .toArray()
        // Failed to find the post, cache false
        if (!posts.length) return false
        return posts[0]
    })
    if (!post) throw new NoContentError('Post cannot be found.', slug)
    return post
}
