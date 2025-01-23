import Mongo from '@common/data/mongo/mongo'
import { getCachedData } from '@src/db/mongo/object-cache'
import { DAY_IN_SECONDS } from '@common/constants/datetime'
import { Post, TermTypes } from '@src/types/wordpress'
import { getPostsBy } from '@src/db/mysql/getPostsBy'
import { getPost } from '@src/db/mongo/wordpress/post'

/**
 * Requests MySQL and save
 *
 * @returns {Promise<void>}
 */
const requestAPI = async (): Promise<void> => {
    const recentPosts = await getPostsBy(TermTypes.recent_posts)
    if (!recentPosts.length) {
        return
    }
    // Update posts
    recentPosts.forEach((post) => {
        getPost(post.slug)
    })
    await Mongo.deleteMany('recent-post', {})
    await Mongo.insertMany('recent-post', recentPosts)
}

export const getRecentPosts = async () =>
    await getCachedData<Post>('recent-post', {}, requestAPI, DAY_IN_SECONDS * 2)
