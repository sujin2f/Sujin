/* Models */
import { Logger } from '@sujin/share/model/Logger'
import { Post } from '@src/schema/post'
/* CONSTANTS */
import { POST_STATUS, PER_PAGE } from '@sujin/lib/constants'
import { AGGREGATE_ARCHIVE_POST, AGGREGATE_EXPAND_ARCHIVES } from '@src/constants'
/* T_Types */
import type { T_ArchivePost } from '@sujin/lib/types'

/**
 * Public resolver that returns a cached list of recent posts.
 *
 * @returns A promise resolving to an array of recent `T_ArchivePost` items.
 */
export const recent = async (): Promise<T_ArchivePost[]> => {
    const result = await Post.aggregate<T_ArchivePost>([
        { $match: { status: POST_STATUS.PUBLISH } },
        { $sort: { date: -1 } },
        { $limit: PER_PAGE },
        ...AGGREGATE_EXPAND_ARCHIVES,
        ...AGGREGATE_ARCHIVE_POST,
    ])
    Logger.info('⭐️ recent query has been finished')
    return result
}
