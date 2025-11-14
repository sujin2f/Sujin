import mongoose from 'mongoose'
import sanitize from 'mongo-sanitize'
/* Models */
import { Page, Post } from '@src/schema/post'
import Logger from '@src/utils/logger'
/* CONSTANTS */
import { COLLECTION, POST_STATUS } from '@sujin/lib/types'
import { PER_PAGE } from '@sujin/lib/constants'
/* Utils */
import { verifyAdmin } from '@src/utils/mongo/verifyUser'
import { cachedRequest, getCacheKey } from '@sujin/lib/utils/cache'
/* T_Types */
import type { Context } from '@src/types'
import { isSearch } from '@src/utils/mongo/isSearch'

type Param = {
    context: string
    id: string
}

export const getNumPages = async (
    _: unknown,
    { id: _id, context: _context }: Param,
    { token }: Context,
): Promise<number> => {
    const context = sanitize(_context)

    let total = 0

    if (context === 'archive-posts') {
        const [id, search] = isSearch(_id)
        const request = cachedRequest(
            countArchivePosts,
            getCacheKey(COLLECTION.ARCHIVE, id, search, 'total'),
        )
        total = await request(id, search)
    }

    if (context === 'pages') {
        if (!(await verifyAdmin(token))) {
            Logger.error(`⛈️ getPages query has been called by non admin user`)
            throw new Error(
                `⛈️ flushDB mutation has been called by non admin user`,
            )
        }

        total = await Page.countDocuments()
    }

    Logger.info(`🤟 pages query has been finished: ${_id}`)
    return Math.ceil(total / PER_PAGE)
}

const countArchivePosts = async (
    id: string,
    search: number,
): Promise<number> => {
    const filter = search
        ? {
              $text: { $search: id },
              status: POST_STATUS.PUBLISH,
          }
        : {
              archives: { $in: [new mongoose.Types.ObjectId(id)] },
              status: POST_STATUS.PUBLISH,
          }

    return await Post.countDocuments(filter)
}
