import { Types } from 'mongoose'
import sanitize from 'mongo-sanitize'
/* Models */
import { Logger } from '@sujin/share/model/Logger'
import { Post } from '@src/schema/post'
/* CONSTANTS */
import { PER_PAGE, POST_STATUS, ARCHIVE, COLLECTION } from '@sujin/lib/constants'
import { AGGREGATE_ARCHIVE_POST, AGGREGATE_EXPAND_ARCHIVES } from '@src/constants'
import { WEEK_IN_SECONDS } from '@sujin/share/constants/datetime'
/* Utils */
import { category as getCategory } from '@src/resolvers/wordpress/archives/category'
import { tag } from '@src/resolvers/wordpress/archives/tag'
import { setCache } from '@src/utils/redis/cache'
/* T_Types */
import type { T_Post, WithNumPages } from '@sujin/lib/types'

/**
 * Fetch paginated posts for a given archive (category or tag).
 *
 * - Resolves the archive (category or tag) by slug.
 * - Uses an aggregation pipeline to return expanded post documents and
 *   calculates the total number of pages.
 * - Throws `GraphQLError` with code `NO_CONTENT` when no posts are found.
 *
 * @param _type - Archive type (`ARCHIVE.CATEGORY` or `ARCHIVE.TAG`).
 * @param _slug - Archive slug to fetch posts for.
 * @param _page - Page number (1-based).
 * @returns An object containing `items` (posts) and `numPages`.
 */
export const posts = async (_type: ARCHIVE, _slug: string, _page: number): Promise<WithNumPages<T_Post, 'items'>> => {
    const type = sanitize(_type)
    const slug = sanitize(_slug)
    const page = sanitize(_page)

    const archive = type === ARCHIVE.CATEGORY ? await getCategory(slug) : await tag(slug)
    const $match = {
        archives: { $in: [new Types.ObjectId(archive._id)] },
        status: POST_STATUS.PUBLISH,
    }

    const items = await Post.aggregate<T_Post>([
        { $match },
        { $sort: { date: -1 } },
        { $skip: PER_PAGE * (page - 1) },
        { $limit: PER_PAGE },
        ...AGGREGATE_EXPAND_ARCHIVES,
        ...AGGREGATE_ARCHIVE_POST,
    ])
        .then((result) => {
            if (!result || !result.length) {
                setCache(
                    JSON.stringify({ items: [], numPages: 0 }),
                    `${COLLECTION.POST}-archive-${_type}-${_slug}-${_page}`,
                    WEEK_IN_SECONDS,
                )
                throw new Error(`🤬 Cannot find the post from archive ${slug}`)
            }
            return result
        })
        .catch((e) => {
            Logger.error(e.message)
            throw e
        })

    const total = await Post.countDocuments($match)
    const result = {
        items,
        numPages: Math.ceil(total / PER_PAGE),
    }

    setCache(JSON.stringify(result), `${COLLECTION.POST}-archive-${_type}-${_slug}-${_page}`, WEEK_IN_SECONDS)
    Logger.info(`⭐️ posts query done: ${slug}, ${page}`)
    return result
}
