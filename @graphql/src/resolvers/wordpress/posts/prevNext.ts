import sanitize from 'mongo-sanitize'
import mongoose from 'mongoose'
/* Models */
import { Logger } from '@sujin/share/model/Logger'
import { Post } from '@src/schema/post'
/* Utils */
import { cachedRequest, getCacheKey } from '@sujin/lib/utils/cache'
import { post as getPost } from '@src/resolvers/wordpress/posts/post'
/* CONSTANTS */
import { COLLECTION, ARCHIVE, POST_STATUS } from '@sujin/lib/constants'
/* T_Types */
import type { T_Post, T_PrevNext } from '@sujin/lib/types'

/**
 * Get the previous and next post relative to a given post slug within the same
 * category.
 *
 * Results are cached under `getCacheKey(COLLECTION.POST, slug, 'prev-next')`.
 *
 * @param _slug - The slug of the reference post.
 * @returns A tuple-like array `[previous, next]` where either element may be `undefined`.
 */
export const prevNext = async (_slug: string): Promise<T_PrevNext[]> => {
    const slug = sanitize(_slug)
    const request = cachedRequest(query, getCacheKey(COLLECTION.POST, slug, 'prev-next'))
    const result = await request(slug)
    Logger.info('🤟 prevNext query has been finished')
    return result
}

/**
 * Internal query that finds the previous and next posts by date within the
 * same category archives as the provided post.
 *
 * @param slug - The reference post slug.
 * @returns Array with previous and next `T_Post` (may contain undefined values).
 */
const query = async (slug: string): Promise<T_PrevNext[]> => {
    const post = await getPost(slug)
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
