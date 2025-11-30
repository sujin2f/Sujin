import sanitize from 'mongo-sanitize'
import mongoose from 'mongoose'
/* Models */
import { Logger } from '@sujin/share/model/Logger'
import { Post } from '@src/schema/post'
/* Utils */
import { cachedRequest, getCacheKey } from '@sujin/lib/utils/cache'
import { post as getPost } from '@src/resolvers/wordpress/posts/post'
import { recent } from '@src/resolvers/wordpress/posts/recent'
/* CONSTANTS */
import { POST_STATUS, COLLECTION } from '@sujin/lib/constants'
import { AGGREGATE_ARCHIVE_POST, AGGREGATE_EXPAND_ARCHIVES } from '@src/constants'
/* T_Types */
import type { T_ArchivePost } from '@sujin/lib/types'

/**
 * Retrieve related posts for a given post slug.
 *
 * Finds posts that share archives with the reference post and falls back to
 * recent posts to fill the list up to 4 items.
 *
 * Results are cached under `getCacheKey(COLLECTION.POST, slug, 'related')`.
 *
 * @param _slug - The slug of the reference post.
 * @returns An array of related `T_ArchivePost` items (max 4).
 */
export const related = async (_slug: string): Promise<T_ArchivePost[]> => {
    const slug = sanitize(_slug)
    const request = cachedRequest(query, getCacheKey(COLLECTION.POST, slug, 'related'))
    const result = await request(slug)
    Logger.info('⭐️ related query has been finished')
    return result
}

/**
 * Internal aggregation that searches for posts sharing archives with the
 * reference post and returns up to 4 items.
 *
 * @param slug - The reference post slug.
 * @returns An array of `T_ArchivePost` results.
 */
const query = async (slug: string): Promise<T_ArchivePost[]> => {
    const post = await getPost(slug)
    const result: Record<number, T_ArchivePost> = {}

    const archive_ids = post.archives.map((archive) => new mongoose.Types.ObjectId(archive._id))

    await Post.aggregate<T_ArchivePost>([
        {
            $match: {
                id: { $not: { $eq: post.id } },
                status: POST_STATUS.PUBLISH,
                archives: { $in: archive_ids },
            },
        },
        {
            $sort: { date: -1 },
        },
        {
            $limit: 4,
        },
        ...AGGREGATE_EXPAND_ARCHIVES,
        ...AGGREGATE_ARCHIVE_POST,
    ]).then((posts) => {
        posts.forEach((item) => {
            result[item.id] = item
        })
    })

    if (Object.keys(result).length === 4) {
        return Object.values(result)
    }

    await recent().then((recent) =>
        recent
            .filter((item) => item.slug !== slug)
            .forEach((item) => {
                result[item.id] = item
            }),
    )
    return Object.values(result).slice(0, 4)
}
