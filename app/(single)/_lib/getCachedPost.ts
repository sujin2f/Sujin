'use server'
import { unstable_cache } from 'next/cache'
import sanitize from 'mongo-sanitize'
/* Models */
import { NoContentError, UnauthorizedError } from '@common/model/Error'
/* Utils */
import { getCollection } from '@common/data/mongo/mongo'
import { getAggregation } from '@app/_lib/utils/server'
import { cachedRequest, getCacheKey } from '@app/_lib/utils/cache'
import { isAdmin } from '@app/api/auth/_lib/utils-server'
/* CONSTANTS */
import { COLLECTION, POST_STATUS, type T_Post } from '@app/_lib/types'
import { VERSION } from '@common/constants/helper'
import { revalidate } from '@app/_lib/constants'

const query = async (slug: string) => {
    const collection = await getCollection<T_Post>(COLLECTION.POST)
    const posts = await collection
        .aggregate<T_Post>([
            { $match: { slug: sanitize(slug) } },
            ...getAggregation('expand-archive'),
        ])
        .toArray()
    if (!posts.length) throw new NoContentError('Post cannot be found.', slug)
    return posts[0]
}
/**
 * Get single post by slug
 * This returns the cached result if it exists
 *
 * @param {string} slug - Post slug
 * @throws {NoContentError}
 */
export const cached = async (slug: string): Promise<T_Post> => {
    const request = cachedRequest(query, getCacheKey(COLLECTION.POST, slug))
    return await request(slug)
}

export const getCachedPost = async (slug: string): Promise<T_Post> => {
    const request = unstable_cache(cached, [slug, VERSION], {
        tags: ['wordpress', 'post'],
        revalidate,
    })
    return await request(slug).then(async (post) => {
        if (!(await isAdmin()) && post.status !== POST_STATUS.PUBLISH) {
            throw new UnauthorizedError('Not Authorized to access this page.')
        }
        return post
    })
}
