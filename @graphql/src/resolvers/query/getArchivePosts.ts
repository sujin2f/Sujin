import mongoose from 'mongoose'
import sanitize from 'mongo-sanitize'
import { GraphQLError } from 'graphql'
/* Models */
import { Post } from '@src/schema/post'
import Logger from '@src/utils/logger'
/* CONSTANTS */
import { COLLECTION, POST_STATUS, type T_ArchivePost } from '@sujin/lib/types'
import { PER_PAGE } from '@sujin/lib/constants'
import {
    AGGREGATE_ARCHIVE_POST,
    AGGREGATE_EXPAND_ARCHIVES,
} from '@src/constants'
/* Utils */
import { isSearch } from '@src/utils/mongo/isSearch'
import { cachedRequest, getCacheKey } from '@sujin/lib/utils/cache'
import { verifyAdmin } from '@src/utils/mongo/verifyUser'
/* T_Type */
import type { Context } from '@src/types'

type Param = {
    id: string
    page: number
    bypassCache: boolean
}

/**
 * Get archive
 * This returns the cached result if it exists
 *
 * @returns {Promise<T_Archive>} - The background array
 */
export const getArchivePosts = async (
    _: unknown,
    { id: _id, page: _page, bypassCache }: Param,
    context: Context,
): Promise<T_ArchivePost[]> => {
    const [id, search] = isSearch(_id)
    const page = sanitize(_page)

    let request: typeof queryArchivePosts

    if (bypassCache) {
        if (!(await verifyAdmin(context.token))) {
            Logger.error(
                `⛈️ getArchives query has been called by non admin user`,
            )
            throw new Error(
                `⛈️ getArchives query has been called by non admin user`,
            )
        }

        request = queryArchivePosts
    } else {
        request = cachedRequest(
            queryArchivePosts,
            getCacheKey(COLLECTION.ARCHIVE, id, page, search),
        )
    }

    const result = await request(id, page, search, bypassCache)
    Logger.info(`🤟 list query has been finished: ${_id}, ${_page}`)
    return result
}

const queryArchivePosts = async (
    id: string,
    page: number,
    search: number,
    bypassCache: boolean,
): Promise<T_ArchivePost[]> => {
    const $match: Record<string, unknown> = search
        ? {
              $text: { $search: id },
          }
        : {
              archives: { $in: [new mongoose.Types.ObjectId(id)] },
          }

    if (!bypassCache) {
        $match.status = POST_STATUS.PUBLISH
    }

    return await Post.aggregate([
        { $match },
        { $sort: { date: -1 } },
        { $skip: PER_PAGE * (page - 1) },
        { $limit: PER_PAGE },
        ...AGGREGATE_EXPAND_ARCHIVES,
        ...AGGREGATE_ARCHIVE_POST,
    ]).then((result) => {
        if (!result || !result.length) {
            throw new GraphQLError(`Cannot find the post from archive ${id}`, {
                extensions: {
                    code: 'NO_CONTENT',
                },
            })
        }
        return result
    })
}
