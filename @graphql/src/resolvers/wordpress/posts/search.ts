import sanitize from 'mongo-sanitize'
/* Models */
import { Logger } from '@common/model/Logger'
import { Post } from '@src/schema/post'
/* CONSTANTS */
import { COLLECTION, PER_PAGE, POST_STATUS } from '@common/constants'
import { AGGREGATE_ARCHIVE_POST, AGGREGATE_EXPAND_ARCHIVES } from '@src/constants'
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
/* T_Types */
import type { T_Post, WithNumPages } from '@common/types'
/* Utils */
import { setCache } from '@src/utils/redis/cache'

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
                setCache(JSON.stringify([]), `${COLLECTION.POST}-search-${_keyword}-${page}`, WEEK_IN_SECONDS)
                throw new Error(`🤬 Cannot find the post from search: ${keyword}, ${page}`)
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
    setCache(JSON.stringify(result), `${COLLECTION.POST}-search-${_keyword}-${page}`, WEEK_IN_SECONDS)
    Logger.info(`⭐️ post search done: ${keyword}, ${page}`)
    return result
}
