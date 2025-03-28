import { ObjectId, type WithId } from 'mongodb'
/* Models */
import Cached from '@common/model/Cached'
import Mongo from '@common/data/mongo/mongo'
/* Constants */
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
import { IS_DEV } from '@common/constants/helper'
/* Utils */
import getPostBy from '@src/db/mysql/getPostBy'
/* Types */
import type { Post } from '@src/types/wordpress'

/**
 * Request single post by slug and type
 * Queries MongoDB first, and MySQL if MongoDB fails
 * @param {string} slug - The slug of post
 * @param {'post' | 'page'} type - The type of post
 * @param {boolean} ignoreStatus - The flag to ignore status
 * @returns {Promise<WithId<Post>>} - The post object
 */
const request = async (
    slug: string,
    type: 'post' | 'page',
    ignoreStatus: boolean,
): Promise<WithId<Post>> =>
    await Mongo.findOne<Post>('post', { slug, type }).catch(async () => {
        const post = await getPostBy('slug', slug, ignoreStatus)
        await Mongo.insertOne('post', post)
        return {
            ...post,
            _id: new ObjectId(),
        }
    })

/**
 * Get single post by slug and type
 * This returns the cached result if it exists
 * @param {string} slug - The slug of post
 * @param {'post' | 'page'} type - The type of post
 * @param {boolean} ignoreStatus - The flag to ignore status
 * @returns {Promise<WithId<Post>>} - The post object
 */
const getPost = async (
    _slug: string,
    type: 'post' | 'page',
    ignoreStatus: boolean = false,
): Promise<WithId<Post>> => {
    const slug = _slug.toLowerCase()
    const key = `post-${slug}`

    return await Cached.getInstance().getOrExecute(
        key,
        async () => await request(slug, type, ignoreStatus),
        WEEK_IN_SECONDS,
        IS_DEV,
    )
}

export default getPost
