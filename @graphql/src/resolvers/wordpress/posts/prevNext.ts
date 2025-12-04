import sanitize from 'mongo-sanitize'
import mongoose from 'mongoose'
/* Models */
import { Logger } from '@sujin/share/model/Logger'
import { Post } from '@src/schema/post'
import { post as getPost } from '@src/resolvers/wordpress/posts/post'
/* CONSTANTS */
import { ARCHIVE, COLLECTION, POST_STATUS } from '@sujin/lib/constants'
import { WEEK_IN_SECONDS } from '@sujin/share/constants/datetime'
/* T_Types */
import type { T_PrevNext } from '@sujin/lib/types'
/* Utils */
import { setCache } from '@src/utils/redis/cache'

/**
 * Get the previous and next post relative to a given post slug within the same
 * category.
 *
 * Results are cached under `getCacheKey(COLLECTION.POST, slug, 'prev-next')`.
 *
 * @param _slug - The slug of the reference post.
 * @returns A tuple-like array `[previous, next]` where either element may be `undefined`.
 */
export const prevNext = async (_slug: string): Promise<(T_PrevNext | undefined)[]> => {
    const slug = sanitize(_slug)
    const post = await getPost(slug)
    const _ids = post.archives
        .filter((archive) => archive.type === ARCHIVE.CATEGORY)
        .map((category) => new mongoose.Types.ObjectId(category._id))

    const prev = await Post.find({
        id: { $ne: post.id },
        status: POST_STATUS.PUBLISH,
        date: { $lt: post.date },
        archives: { $in: _ids },
    })
        .sort({ date: -1 })
        .limit(1)
        .then((result) => {
            if (!result.length) {
                return
            }
            return result[0].toObject() as unknown as T_PrevNext
        })

    const next = await Post.find({
        id: { $ne: post.id },
        status: POST_STATUS.PUBLISH,
        date: { $gt: post.date },
        archives: { $in: _ids },
    })
        .sort({ date: 1 })
        .limit(1)
        .then((result) => {
            if (!result.length) {
                return
            }
            return result[0].toObject() as unknown as T_PrevNext
        })

    const result = [prev, next]
    setCache(JSON.stringify(result), `${COLLECTION.POST}-${_slug}-prevNext`, WEEK_IN_SECONDS)
    Logger.info(`⭐️ prevNext query has been finished ${slug}`)
    return result
}
