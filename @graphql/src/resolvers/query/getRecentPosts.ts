/* Mongoose */
import { Post } from '@src/schema/post'
/* Utils */
import { cachedRequest, getCacheKey } from '@sujin/lib/utils/cache'
/* CONSTANTS */
import { COLLECTION, POST_STATUS, type T_ArchivePost } from '@sujin/lib/types'
import { PER_PAGE } from '@sujin/lib/constants'

/**
 * Fetches the recent posts from MongoDB.
 *
 * @returns {Promise<T_Post[]>} A promise that resolves to the recent posts.
 */
const query = async (): Promise<T_ArchivePost[]> => {
    return await Post.aggregate<T_ArchivePost>([
        { $match: { status: POST_STATUS.PUBLISH } },
        { $sort: { date: -1 } },
        { $limit: PER_PAGE },
        {
            $lookup: {
                from: COLLECTION.ARCHIVE,
                localField: 'archives',
                foreignField: '_id',
                as: 'archives',
                pipeline: [
                    {
                        $addFields: {
                            _id: { $toString: '$_id' },
                        },
                    },
                ],
            },
        },
        {
            $project: {
                content: 0,
                meta: 0,
            },
        },
    ])
}

/**
 * Fetches the recent posts from the cache or MongoDB.
 * It uses a caching mechanism to avoid fetching the posts multiple times within a week.
 *
 * @returns {Promise<T_Post[]>} A promise that resolves to the recent posts.
 */
export const getRecentPosts = async (): Promise<T_ArchivePost[]> => {
    const request = cachedRequest(
        query,
        getCacheKey(COLLECTION.ARCHIVE, 'recent'),
    )
    return await request()
}
