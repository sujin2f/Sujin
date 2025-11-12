'use server'
import sanitize from 'mongo-sanitize'
/* CONSTANTS */
import { COLLECTION, POST_STATUS, type T_ArchivePost } from '@sujin/lib/types'
/* T_Types */
import { cachedRequest, getCacheKey } from '@sujin/lib/utils/cache'
import { Post } from '@src/schema/post'
import { PER_PAGE } from '@sujin/lib/constants'
import mongoose from 'mongoose'

type ParamId = {
    id: string
}

type Param = ParamId & {
    page: number
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
    const id = sanitize(_id)
    const page = sanitize(_page)

    const request = cachedRequest(
        queryArchivePosts,
        getCacheKey(COLLECTION.ARCHIVE, id, page),
    )

    return await request(id, page)
}

const queryArchivePosts = async (
    id: string,
    page: number,
): Promise<T_ArchivePost[]> => {
    return await Post.aggregate([
        {
            $match: {
                archives: { $in: [new mongoose.Types.ObjectId(id)] },
                status: POST_STATUS.PUBLISH,
            },
        },
        { $sort: { date: -1 } },
        { $skip: PER_PAGE * (page - 1) },
        { $limit: PER_PAGE },
        {
            $lookup: {
                from: 'archives',
                localField: 'archives',
                foreignField: '_id',
                as: 'archives',
                pipeline: [
                    {
                        $addFields: { _id: { $toString: '$_id' } },
                    },
                ],
            },
        },
        {
            $project: {
                content: 0,
                meta: 0,
            },
        },
    ])
}

export const getNumPosts = async (_: unknown, { id: _id }: ParamId) => {
    const id = sanitize(_id)
    const request = cachedRequest(
        queryNumPosts,
        getCacheKey(COLLECTION.ARCHIVE, id, 'total'),
    )

    return await request(id)
}

const queryNumPosts = async (id: string): Promise<number> => {
    const total = await Post.countDocuments({
        archives: { $in: [id] },
        status: POST_STATUS.PUBLISH,
    })
    return Math.ceil(total / PER_PAGE)
}
