import { Types } from 'mongoose'
import { GraphQLError } from 'graphql'
import sanitize from 'mongo-sanitize'
/* Models */
import Logger from '@src/utils/logger'
import { Post } from '@src/schema/post'
/* CONSTANTS */
import {
    PER_PAGE,
    COLLECTION,
    POST_STATUS,
    ARCHIVE,
} from '@sujin/lib/constants'
import {
    AGGREGATE_ARCHIVE_POST,
    AGGREGATE_EXPAND_ARCHIVES,
} from '@src/constants'
/* Utils */
import { cachedRequest, getCacheKey } from '@sujin/lib/utils/cache'
import { category as getCategory } from '@src/resolvers/wordpress/archives/category'
/* T_Types */
import type { T_Post, WithNumPages } from '@sujin/lib/types'
import { tag } from '../archives/tag'

/**
 * Get/Update/Remove post(s)
 *
 * @returns {Promise<T_Post[]>}
 */
export const posts = async (
    _type: ARCHIVE,
    _slug: string,
    _page: number,
): Promise<WithNumPages<T_Post, 'items'>> => {
    const type = sanitize(_type)
    const slug = sanitize(_slug)
    const page = sanitize(_page)

    const archive =
        type === ARCHIVE.CATEGORY ? await getCategory(slug) : await tag(slug)
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
        getCacheKey(COLLECTION.POST, type, slug, page),
    )
    const result = await request()
    Logger.info(`🤟 posts query done: ${slug}, ${page}`)
    return result
}
