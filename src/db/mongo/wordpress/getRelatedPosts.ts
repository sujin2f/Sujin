import type { WithId } from 'mongodb'
// Models
import { Cached } from '@common/model/Cached'
import Mongo from '@common/data/mongo/mongo'
// Helpers
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
import type { Post } from '@src/types/wordpress'
import { getRecentPosts } from '@src/db/mongo/wordpress/getRecentPosts'

/**
 * Fetches the related posts from MongoDB.
 *
 * @returns {Promise<WithId<Post>[]>} A promise that resolves to the related posts.
 * @throws {Error} Throws an error if fetching process fails.
 */
const request = async (
    id: number,
    categories: string,
    tags: string,
): Promise<WithId<Post>[]> => {
    const categorySlugs = categories.split(',')
    const tagSlugs = tags.split(',')
    const postTags = await Mongo.findMany<Post>(
        'post',
        {
            id: { $ne: id },
            type: 'post',
            status: 'publish',
            'tags.slug': { $in: tagSlugs },
        },
        { sort: { date: -1 }, limit: 4 },
    )
    const postCategories = await Mongo.findMany<Post>(
        'post',
        {
            id: { $ne: id },
            type: 'post',
            status: 'publish',
            'categories.slug': { $in: categorySlugs },
        },
        { sort: { date: -1 }, limit: 4 },
    )
    const recent = await getRecentPosts()
    return Array.from(
        new Set([...postTags, ...postCategories, ...recent]),
    ).slice(0, 4)
}

/**
 * Fetches the related posts from the cache or MongoDB.
 * It uses a caching mechanism to avoid fetching the posts multiple times within a week.
 *
 * @returns {Promise<WithId<Post>[]>} A promise that resolves to the related posts.
 * @throws {Error} Throws an error if the caching or fetching process fails.
 */
export const getRelatedPosts = async (
    id: number,
    categories: string,
    tags: string,
): Promise<WithId<Post>[]> => {
    return await Cached.getInstance().getOrExecute(
        `related-${id}`,
        async () => await request(id, categories, tags),
        WEEK_IN_SECONDS,
        true,
    )
}
