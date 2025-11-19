/* Models */
import Logger from '@src/utils/logger'
import { Post } from '@src/schema/post'
/* Utils */
import { cachedRequest, getCacheKey } from '@sujin/lib/utils/cache'
/* CONSTANTS */
import { POST_STATUS, COLLECTION, PER_PAGE } from '@sujin/lib/constants'
import {
    AGGREGATE_ARCHIVE_POST,
    AGGREGATE_EXPAND_ARCHIVES,
} from '@src/constants'
/* T_Types */
import type { T_ArchivePost } from '@sujin/lib/types'

/**
 * Internal aggregation query to fetch the most recent published posts.
 *
 * @returns A promise resolving to an array of `T_ArchivePost` items.
 */
const query = async (): Promise<T_ArchivePost[]> => {
    return await Post.aggregate<T_ArchivePost>([
        { $match: { status: POST_STATUS.PUBLISH } },
        { $sort: { date: -1 } },
        { $limit: PER_PAGE },
        ...AGGREGATE_EXPAND_ARCHIVES,
        ...AGGREGATE_ARCHIVE_POST,
    ])
}

/**
 * Public resolver that returns a cached list of recent posts.
 *
 * Uses `cachedRequest` with `getCacheKey(COLLECTION.ARCHIVE, 'recent')`.
 *
 * @returns A promise resolving to an array of recent `T_ArchivePost` items.
 */
export const recent = async (): Promise<T_ArchivePost[]> => {
    const request = cachedRequest(
        query,
        getCacheKey(COLLECTION.ARCHIVE, 'recent'),
    )
    const result = await request()
    Logger.info('🤟 recent query has been finished')
    return result
}
