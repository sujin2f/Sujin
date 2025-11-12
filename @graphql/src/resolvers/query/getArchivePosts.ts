'use server'
import sanitize from 'mongo-sanitize'
/* CONSTANTS */
import { COLLECTION, POST_STATUS, type T_ArchivePost } from '@sujin/lib/types'
/* T_Types */
import { cachedRequest, getCacheKey } from '@sujin/lib/utils/cache'
import { Post } from '@src/schema/post'
import { PER_PAGE } from '@sujin/lib/constants'
import mongoose from 'mongoose'
import { AGGREGATE_EXPAND_ARCHIVES } from '@src/constants'

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

    return await request(id, page, search)
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
    ])
}

export const getNumPosts = async (_: unknown, { id: _id }: ParamId) => {
    const [id, search] = isSearch(_id)
    const request = cachedRequest(
        queryNumPosts,
        getCacheKey(COLLECTION.ARCHIVE, id, search, 'total'),
    )

    return await request(id, search)
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
