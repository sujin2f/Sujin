import { Types } from 'mongoose'
import sanitize from 'mongo-sanitize'
/* Models */
import { Logger } from '@common/model/Logger'
import { Post } from '@src/schema/post'
/* CONSTANTS */
import { PER_PAGE } from '@common/constants'
import { AGGREGATE_ARCHIVE_POST, AGGREGATE_EXPAND_ARCHIVES } from '@src/constants'
/* Utils */
import { category as getCategory } from '@src/resolvers/wordpress/archives/category'
import { verifyAccessToken, verifyAdmin } from '@src/utils/security'
/* T_Types */
import type { T_Post } from '@common/types'

/**
 * Return posts that belong to the category identified by `slug` for admin
 * interfaces. This resolver enforces that the caller is an admin and uses a
 * MongoDB aggregation pipeline to expand and format post/archives data.
 *
 * @param _slug - Archive/category slug to filter posts by.
 * @param _page - 1-based page number for pagination (uses `PER_PAGE`).
 * @param token - Access token.
 * @returns A page of `T_Post` documents belonging to the archive.
 * @throws {GraphQLError} When no posts are found for the archive.
 */
export const postsAdmin = async (_slug: string, _page: number, token: string): Promise<T_Post[]> => {
    const user = await verifyAccessToken(token)
    await verifyAdmin(user.email)

    const slug = sanitize(_slug)
    const page = sanitize(_page)
    const archive = await getCategory(slug)
    const result = await Post.aggregate<T_Post>([
        {
            $match: {
                archives: { $in: [new Types.ObjectId(archive._id)] },
            },
        },
        { $sort: { date: -1 } },
        { $skip: PER_PAGE * (page - 1) },
        { $limit: PER_PAGE },
        ...AGGREGATE_EXPAND_ARCHIVES,
        ...AGGREGATE_ARCHIVE_POST,
    ])
    Logger.info(`🤞 postsAdmin query done: ${slug}, ${page}`)
    return result
}
