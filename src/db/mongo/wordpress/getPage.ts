import { ObjectId, type WithId } from 'mongodb'
/* Models */
import Cached from '@common/model/Cached'
import Mongo from '@common/data/mongo/mongo'
/* Constants */
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
import { IS_DEV, VERSION } from '@common/constants/helper'
/* Utils */
import getPostBy from '@src/db/mysql/getPostBy'
/* Types */
import type { Post } from '@src/types/wordpress'

/**
 * Request single post by slug and type
 * Queries MongoDB first, and MySQL if MongoDB fails
 * @param {string} slug - The slug of post
 * @returns {Promise<WithId<Post>>} - The post object
 */
const request = async (slug: string): Promise<WithId<Post>> =>
    await Mongo.findOne<Post>('page', { slug }).catch(async () => {
        const post = await getPostBy('slug', slug, 'page', false)
        await Mongo.insertOne('page', post)
        return {
            ...post,
            _id: new ObjectId(),
        }
    })

/**
 * Get single post by slug and type
 * This returns the cached result if it exists
 * @param {string} _slug - The slug of post
 * @returns {Promise<WithId<Post>>} - The post object
 */
const getPage = async (_slug: string): Promise<WithId<Post>> => {
    const slug = _slug.toLowerCase()
    const key = `page-${slug}-${VERSION}`

    return await Cached.getInstance().getOrExecute(
        key,
        async () => await request(slug),
        WEEK_IN_SECONDS,
        IS_DEV,
    )
}

export default getPage
