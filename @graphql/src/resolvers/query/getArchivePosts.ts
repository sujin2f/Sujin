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
/* T_Types */
import { cachedRequest, getCacheKey } from '@sujin/lib/utils/cache'

type ParamId = {
    id: string
}

type Param = ParamId & {
    page: number
}

const isSearch = (id: string): [string, number] => {
    const search = id.startsWith('search-')
    return [sanitize(search ? id.slice(7) : id), search ? 1 : 0]
}

/**
 * Get archive
 * This returns the cached result if it exists
 *
 * @returns {Promise<T_Archive>} - The background array
 */
export const getArchivePosts = async (
    _: unknown,
    { id: _id, page: _page }: Param,
): Promise<T_ArchivePost[]> => {
    const [id, search] = isSearch(_id)
    const page = sanitize(_page)

    const request = cachedRequest(
        queryArchivePosts,
        getCacheKey(COLLECTION.ARCHIVE, id, page, search),
    )
    const result = await request(id, page, search)
    Logger.info(`🤟 list query has been finished: ${_id}, ${_page}`)
    return result
}

const queryArchivePosts = async (
    id: string,
    page: number,
    search: number,
): Promise<T_ArchivePost[]> => {
    const $match = search
        ? {
              $text: { $search: id },
              status: POST_STATUS.PUBLISH,
          }
        : {
              archives: { $in: [new mongoose.Types.ObjectId(id)] },
              status: POST_STATUS.PUBLISH,
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

export const getNumPosts = async (_: unknown, { id: _id }: ParamId) => {
    const [id, search] = isSearch(_id)
    const request = cachedRequest(
        queryNumPosts,
        getCacheKey(COLLECTION.ARCHIVE, id, search, 'total'),
    )
    const result = await request(id, search)
    Logger.info(`🤟 pages query has been finished: ${_id}`)
    return result
}

const queryNumPosts = async (id: string, search: number): Promise<number> => {
    const filter = search
        ? {
              $text: { $search: id },
              status: POST_STATUS.PUBLISH,
          }
        : {
              archives: { $in: [new mongoose.Types.ObjectId(id)] },
              status: POST_STATUS.PUBLISH,
          }

    const total = await Post.countDocuments(filter)
    return Math.ceil(total / PER_PAGE)
}
