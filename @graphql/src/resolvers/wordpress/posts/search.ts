import { GraphQLError } from 'graphql'
import sanitize from 'mongo-sanitize'
/* Models */
import { Logger } from '@sujin/share/model/Logger'
import { Post } from '@src/schema/post'
/* CONSTANTS */
import { PER_PAGE, COLLECTION, POST_STATUS } from '@sujin/lib/constants'
import { AGGREGATE_ARCHIVE_POST, AGGREGATE_EXPAND_ARCHIVES } from '@src/constants'
/* Utils */
import { cachedRequest, getCacheKey } from '@sujin/lib/utils/cache'
/* T_Types */
import type { T_Post, WithNumPages } from '@sujin/lib/types'

/**
 * Search posts by text index and return paginated results.
 *
 * Uses MongoDB text search and aggregation to return expanded post documents.
 * Throws a `GraphQLError` with code `NO_CONTENT` when no results are found.
 *
 * @param _keyword - Search keyword.
 * @param _page - Page number (1-based).
 * @returns Paginated search results with `items` and `numPages`.
 */
export const search = async (_keyword: string, _page: number): Promise<WithNumPages<T_Post, 'items'>> => {
    const keyword = sanitize(_keyword)
    const page = sanitize(_page)

    const $match = { status: POST_STATUS.PUBLISH, $text: { $search: keyword } }
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
                    throw new GraphQLError(`Cannot find the post from search: ${keyword}, ${page}`, {
                        extensions: {
                            code: 'NO_CONTENT',
                        },
                    })
                }
                return result
            })
            const total = await Post.countDocuments($match)
            return {
                items,
                numPages: Math.ceil(total / PER_PAGE),
            }
        },
        getCacheKey(COLLECTION.POST, 'search', keyword, page),
    )
    const result = await request()
    Logger.info(`🤞 post search done: ${keyword}, ${page}`)
    return result
}
