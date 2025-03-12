import type { WithId } from 'mongodb'
// Models
import { Cached } from '@common/model/Cached'
import Mongo from '@common/data/mongo/mongo'
// Helpers
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
import type { Post } from '@src/types/wordpress'

/**
 * Fetches the recent posts from MongoDB.
 *
 * @returns {Promise<WithId<Post>[]>} A promise that resolves to the recent posts.
 * @throws {Error} Throws an error if fetching process fails.
 */
const request = async (): Promise<WithId<Post>[]> =>
    await Mongo.findMany<Post>(
        'post',
        { type: 'post', status: 'publish' },
        { sort: { date: -1 }, limit: 12 },
    )

/**
 * Fetches the recent posts from the cache or MongoDB.
 * It uses a caching mechanism to avoid fetching the posts multiple times within a week.
 *
 * @returns {Promise<WithId<Post>[]>} A promise that resolves to the recent posts.
 * @throws {Error} Throws an error if the caching or fetching process fails.
 */
export const getRecentPosts = async (): Promise<WithId<Post>[]> =>
    await Cached.getInstance().getOrExecute(
        'recent-posts',
        async () => await request(),
        WEEK_IN_SECONDS,
    )
