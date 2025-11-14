import sanitize from 'mongo-sanitize'
import mongoose from 'mongoose'
/* Models */
import Logger from '@src/utils/logger'
import { Post } from '@src/schema/post'
/* Utils */
import { cachedRequest, getCacheKey } from '@sujin/lib/utils/cache'
import { getPost } from '@src/resolvers/query/getPost'
/* CONSTANTS */
import {
    ARCHIVE,
    COLLECTION,
    POST_STATUS,
    T_Post,
    T_PrevNext,
} from '@sujin/lib/types'

/**
 * Fetches the recent posts from MongoDB.
 *
 * @returns {Promise<T_Post[]>} A promise that resolves to the recent posts.
 */
const query = async (slug: string): Promise<T_PrevNext[]> => {
    const post = (await getPost(null, { slug, type: 'post' })) as T_Post
    const _ids = post.archives
        .filter((archive) => archive.type === ARCHIVE.CATEGORY)
        .map((category) => new mongoose.Types.ObjectId(category._id))

    const prev = await Post.find<T_Post>({
        id: { $ne: post.id },
        status: POST_STATUS.PUBLISH,
        date: { $lt: post.date },
        archives: { $in: _ids },
    })
        .sort({ date: -1 })
        .limit(1)

    const next = await Post.find<T_Post>({
        id: { $ne: post.id },
        status: POST_STATUS.PUBLISH,
        date: { $gt: post.date },
        archives: { $in: _ids },
    })
        .sort({ date: 1 })
        .limit(1)

    return [prev[0], next[0]]
}

type Param = {
    slug: string
}

/**
 * Fetches the recent posts from the cache or MongoDB.
 * This returns the cached result if it exists
 *
 * @param {string} slug - The id of the post
 * @returns {Promise<T_PrevNext[]>} A promise that resolves to the recent posts.
 */
export const getPrevNext = async (
    _: unknown,
    { slug: _slug }: Param,
): Promise<T_PrevNext[]> => {
    const slug = sanitize(_slug)
    const request = cachedRequest(
        query,
        getCacheKey(COLLECTION.POST, slug, 'prev-next'),
    )
    const result = await request(slug)
    Logger.info('🤟 prevNext query has been finished')
    return result
}
