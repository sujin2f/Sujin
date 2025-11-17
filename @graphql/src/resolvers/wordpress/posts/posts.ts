import { Types } from 'mongoose'
import { GraphQLError } from 'graphql'
import sanitize from 'mongo-sanitize'
/* Models */
import Logger from '@src/utils/logger'
import { Post } from '@src/schema/post'
/* CONSTANTS */
import { PER_PAGE, COLLECTION, POST_STATUS } from '@sujin/lib/constants'
import {
    AGGREGATE_ARCHIVE_POST,
    AGGREGATE_EXPAND_ARCHIVES,
} from '@src/constants'
/* Utils */
import { cachedRequest, getCacheKey } from '@sujin/lib/utils/cache'
import { category as getCategory } from '@src/resolvers/wordpress/archives/category'
/* T_Types */
import type { T_Post, WithNumPages } from '@sujin/lib/types'

/**
 * Get/Update/Remove post(s)
 *
 * @returns {Promise<T_Post[]>}
 */
export const posts = async (
    _slug: string,
    _page: number,
): Promise<WithNumPages<T_Post, 'items'>> => {
    const slug = sanitize(_slug)
    const page = sanitize(_page)

    const archive = await getCategory(slug)
    const $match = {
        archives: { $in: [new Types.ObjectId(archive._id)] },
        status: POST_STATUS.PUBLISH,
    }

    const request = cachedRequest(
        async (): Promise<WithNumPages<T_Post, 'items'>> => {
            const items = await Post.aggregate<T_Post>([
                { $match },
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
            const numPages = await Post.countDocuments($match)
            return {
                items,
                numPages,
            }
        },
        getCacheKey(COLLECTION.POST, 'by-category', slug, page),
    )
    const result = await request()
    Logger.info(`🤟 posts query done: ${slug}, ${page}`)
    return result
}
