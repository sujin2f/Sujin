import type { WithId } from 'mongodb'
/* Models */
import Cached from '@common/model/Cached'
import Mongo from '@common/data/mongo/mongo'
/* Constants */
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
import { IS_DEV, VERSION } from '@common/constants/helper'
/* Types */
import type { Post } from '@src/types/wordpress'
/* Utils */
import getRecentPosts from '@src/db/mongo/wordpress/getRecentPosts'

/**
 * Fetches the related posts from MongoDB.
 * @param {number} id - The ID of the post.
 * @param {string} categories - The categories of the post.
 * @param {string} tags - The tags of the post.
 * @returns {Promise<WithId<Post>[]>} A promise that resolves to the related posts.
 */
const request = async (
    id: number,
    categories: string,
    tags: string,
): Promise<WithId<Post>[]> => {
    const categorySlugs = categories.split(',')
    const tagSlugs = tags.split(',')
    const relatedByTags = await Mongo.findMany<Post>(
        'post',
        {
            id: { $ne: id },
            type: 'post',
            status: 'publish',
            'tags.slug': { $in: tagSlugs },
        },
        { sort: { date: -1 }, limit: 4 },
    )
    const relatedByCategories = await Mongo.findMany<Post>(
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
        new Set([...relatedByTags, ...relatedByCategories, ...recent]),
    ).slice(0, 4)
}

/**
 * Fetches the related posts from the cache or MongoDB.
 * It uses a caching mechanism to avoid fetching the posts multiple times within a week.
 * @param {number} id - The ID of the post.
 * @param {string} categories - The categories of the post.
 * @param {string} tags - The tags of the post.
 * @returns {Promise<WithId<Post>[]>} A promise that resolves to the related posts.
 */
const getRelatedPosts = async (
    id: number,
    categories: string,
    tags: string,
): Promise<WithId<Post>[]> =>
    await Cached.getInstance().getOrExecute(
        `related-${id}-${VERSION}`,
        async () => await request(id, categories, tags),
        WEEK_IN_SECONDS,
        IS_DEV,
    )

export default getRelatedPosts
