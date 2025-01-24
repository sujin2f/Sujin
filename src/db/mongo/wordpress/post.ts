import Mongo from '@common/data/mongo/mongo'
import { SECOND_IN_MS, WEEK_IN_SECONDS } from '@common/constants/datetime'
import { getPost as queryPost } from '@src/db/mysql/getPost'
import { Post } from '@src/types/wordpress'
import type { WithCache } from '@src/db/mongo/util'

/**
 * Requests MySQL and save
 *
 * @returns {Promise<void>}
 */
const requestAPI = async (
    slug: string,
    action: 'insert' | 'replace',
): Promise<Post | undefined> =>
    queryPost('slug', slug).then((result) => {
        if (result) {
            const doc = {
                ...result,
                expired: Date.now() / SECOND_IN_MS + WEEK_IN_SECONDS,
            }

            if (action === 'insert') {
                Mongo.insertOne('post', doc)
            } else {
                Mongo.replaceOne('post', { slug }, doc)
            }
        }

        return result
    })

export const getPost = async (_slug: string) => {
    const slug = _slug.toLowerCase()
    const post = await Mongo.findOne<WithCache<Post>>('post', {
        slug,
    }).catch(() => null)

    // Post is not found
    if (!post) {
        return await requestAPI(slug, 'insert')
    }

    // Check if the cache is not expired
    if (post.expired > Date.now() / SECOND_IN_MS) {
        return post
    }

    // If the cache is expired, update the cache
    requestAPI(slug, 'replace')
    return post
}
