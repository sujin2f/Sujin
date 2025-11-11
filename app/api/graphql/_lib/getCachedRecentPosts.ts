import { unstable_cache } from 'next/cache'
/* Utils */
import { getCollection } from '@sujin/common/data/mongo/mongo'
import { getAggregation } from '@app/_lib/utils/server'
import { cachedRequest, getCacheKey } from '@app/_lib/utils/cache'
/* CONSTANTS */
import {
    COLLECTION,
    POST_STATUS,
    type T_Post,
    type T_ArchivePost,
} from '@app/_lib/types'
import { VERSION } from '@sujin/common/constants/helper'
import { revalidate } from '@app/_lib/constants'

/**
 * Fetches the recent posts from MongoDB.
 *
 * @returns {Promise<T_Post[]>} A promise that resolves to the recent posts.
 */
const query = async (): Promise<T_ArchivePost[]> => {
    const collection = await getCollection<T_Post>(COLLECTION.POST)
    return await collection
        .aggregate<T_ArchivePost>([
            {
                $match: { status: POST_STATUS.PUBLISH },
            },
            {
                $sort: { date: -1 },
            },
            ...getAggregation('paging', 1),
            ...getAggregation('expand-archive'),
            ...getAggregation('to-archive-post'),
        ])
        .toArray()
}

/**
 * Fetches the recent posts from the cache or MongoDB.
 * It uses a caching mechanism to avoid fetching the posts multiple times within a week.
 *
 * @returns {Promise<T_Post[]>} A promise that resolves to the recent posts.
 */
const cached = async (): Promise<T_ArchivePost[]> => {
    const request = cachedRequest(
        query,
        getCacheKey(COLLECTION.ARCHIVE, 'recent'),
    )
    return await request()
}

export const getCachedRecentPosts = async (): Promise<T_ArchivePost[]> => {
    const request = unstable_cache(cached, [VERSION], {
        tags: ['wordpress', 'recent'],
        revalidate,
    })
    return await request()
}
