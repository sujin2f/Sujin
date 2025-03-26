import type { WithId } from 'mongodb'
/* Models */
import { Cached } from '@common/model/Cached'
import Mongo from '@common/data/mongo/mongo'
/* Constants */
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
import { IS_DEV } from '@common/constants/helper'
/* Types */
import type { Post } from '@src/types/wordpress'

/**
 * Fetches the recent posts from MongoDB.
 * @returns {Promise<WithId<Post>[]>} A promise that resolves to the recent posts.
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
 * This returns the cached result if it exists
 * @param {number} id - The id of the post
 * @param {number} date - The date of the post
 * @param {string} categories - The categories of the post
 * @returns {Promise<WithId<Post>[]>} A promise that resolves to the recent posts.
 */
const getPrevNext = async (
    id: number,
    date: number,
    categories: string,
): Promise<WithId<Post>[]> =>
    await Cached.getInstance().getOrExecute(
        `prev-next-${id}`,
        async () => await request(id, date, categories),
        WEEK_IN_SECONDS,
        IS_DEV,
    )

export default getPrevNext
