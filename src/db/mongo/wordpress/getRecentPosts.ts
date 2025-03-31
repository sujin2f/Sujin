import type { WithId } from 'mongodb'
/* Models */
import Cached from '@common/model/Cached'
import Mongo from '@common/data/mongo/mongo'
/* Constants */
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
import { IS_DEV, VERSION } from '@common/constants/helper'
/* Types */
import type { Post } from '@src/types/wordpress'

/**
 * Fetches the recent posts from MongoDB.
 * @returns {Promise<WithId<Post>[]>} A promise that resolves to the recent posts.
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
 * @returns {Promise<WithId<Post>[]>} A promise that resolves to the recent posts.
 */
const getRecentPosts = async (): Promise<WithId<Post>[]> =>
    await Cached.getInstance().getOrExecute(
        `recent-posts-${VERSION}`,
        async () => await request(),
        WEEK_IN_SECONDS,
        IS_DEV,
    )

export default getRecentPosts
