import type { WithId } from 'mongodb'
/* Models */
import { Cached } from '@common/model/Cached'
import Mongo from '@common/data/mongo/mongo'
/* Constants */
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
/* Types */
import type { Post } from '@src/types/wordpress'
/* Utils */
import { isDev } from '@common/utils/system'

/**
 * Fetches the recent posts from MongoDB.
 *
 * @returns {Promise<WithId<Post>[]>} A promise that resolves to the recent posts.
 * @throws {Error} Throws an error if fetching process fails.
 */
const request = async (
    id: number,
    date: number,
    categories: string,
): Promise<WithId<Post>[]> => {
    const categorySlugs = categories.split(',')
    const prev = await Mongo.findMany<Post>(
        'post',
        {
            id: { $ne: id },
            type: 'post',
            status: 'publish',
            date: { $lt: date * 1000 },
            'categories.slug': { $in: categorySlugs },
        },
        { sort: { date: -1 }, limit: 1 },
    )
    const next = await Mongo.findMany<Post>(
        'post',
        {
            id: { $ne: id },
            type: 'post',
            status: 'publish',
            date: { $gt: date * 1000 },
            'categories.slug': { $in: categorySlugs },
        },
        { sort: { date: 1 }, limit: 1 },
    )
    return [prev[0], next[0]]
}

/**
 * Fetches the recent posts from the cache or MongoDB.
 * It uses a caching mechanism to avoid fetching the posts multiple times within a week.
 *
 * @returns {Promise<WithId<Post>[]>} A promise that resolves to the recent posts.
 * @throws {Error} Throws an error if the caching or fetching process fails.
 */
export const getPrevNext = async (
    id: number,
    date: number,
    categories: string,
): Promise<WithId<Post>[]> => {
    return await Cached.getInstance().getOrExecute(
        `prev-next-${id}`,
        async () => await request(id, date, categories),
        WEEK_IN_SECONDS,
        isDev,
    )
}
