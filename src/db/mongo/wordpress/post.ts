import Mongo from '@common/data/mongo/mongo'
import { getCachedData } from '@src/db/mongo/object-cache'
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
import { getPost as queryPost } from '@src/db/mysql/getPost'
import { Post } from '@src/types/wordpress'
import { Filter } from 'mongodb'

/**
 * Requests MySQL and save
 *
 * @returns {Promise<void>}
 */
const requestAPI = async (doc: Filter<Post>): Promise<void> => {
    const { slug } = doc as { slug: string }
    const post = await queryPost('slug', slug)
    if (!post) {
        return
    }
    await Mongo.deleteMany('post', { slug })
    await Mongo.insertMany('post', [post])
}

export const getPost = async (slug: string) =>
    (
        await getCachedData<Post>(
            'post',
            { slug: slug.toLowerCase() },
            requestAPI,
            WEEK_IN_SECONDS,
        )
    )[0]
