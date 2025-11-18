import { Types } from 'mongoose'
import { GraphQLError } from 'graphql'
import sanitize from 'mongo-sanitize'
/* Models */
import Logger from '@src/utils/logger'
import { Post } from '@src/schema/post'
/* CONSTANTS */
import { PER_PAGE } from '@sujin/lib/constants'
import {
    AGGREGATE_ARCHIVE_POST,
    AGGREGATE_EXPAND_ARCHIVES,
} from '@src/constants'
/* Utils */
import { category as getCategory } from '@src/resolvers/wordpress/archives/category'
import { verifyAdmin } from '@src/utils/security'
/* T_Types */
import type { T_Post } from '@sujin/lib/types'

/**
 * Get/Update/Remove post(s)
 *
 * @returns {Promise<T_Post[]>}
 */
export const postsAdmin = async (
    _slug: string,
    _page: number,
    token: string,
): Promise<T_Post[]> => {
    verifyAdmin(token, 'postsAdmin query has been called by non admin user')

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
    ]).then((result) => {
        if (!result || !result.length) {
            throw new GraphQLError(
                `Cannot find the post from archive ${slug}`,
                {
                    extensions: {
                        code: 'NO_CONTENT',
                    },
                },
            )
        }
        return result
    })
    Logger.info(`🤟 postsAdmin query done: ${slug}, ${page}`)
    return result
}
