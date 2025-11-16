import { Types } from 'mongoose'
import sanitize from 'mongo-sanitize'
/* Models */
import { Page, Post } from '@src/schema/post'
import Logger from '@src/utils/logger'
/* CONSTANTS */
import {
    POST_STATUS,
    COLLECTION,
    ARCHIVE,
    GQL_QUERY_TYPE,
    NUM_PAGES_CONTEXT,
} from '@sujin/lib/constants'
import { PER_PAGE } from '@sujin/lib/constants'
/* Utils */
import { verifyAdmin } from '@src/utils/mongo/verifyUser'
import { cachedRequest, getCacheKey } from '@sujin/lib/utils/cache'
/* T_Types */
import type { Context } from '@src/types'
import { isSearch } from '@src/utils/mongo/isSearch'
import { Archive } from '@src/schema/archive'
import { archive as getArchive } from '../archive'

type Param = {
    context: NUM_PAGES_CONTEXT
    category: string
    type: ARCHIVE
}

export const getNumPages = async (
    _: unknown,
    { category: _category, context: _context, type: _type }: Param,
    { token }: Context,
): Promise<number> => {
    const context = sanitize(_context)
    const category = sanitize(_category)
    const type = sanitize(_type)

    let total = NaN

    switch (context) {
        case NUM_PAGES_CONTEXT.POSTS_BY_CATEGORY: {
            const [id, search] = isSearch(category)
            const request = cachedRequest(
                countArchivePosts,
                getCacheKey(COLLECTION.ARCHIVE, id, search, 'total'),
            )
            total = await request(id, search, token)
            break
        }
        case NUM_PAGES_CONTEXT.PAGE_LIST:
            verifyAdmin(
                token,
                'numPages query has been called by non admin user',
            )
            total = await Page.countDocuments()
            break
        case NUM_PAGES_CONTEXT.ARCHIVE_LIST: {
            verifyAdmin(
                token,
                'numPages query has been called by non admin user',
            )
            total = await Archive.countDocuments({ type })
            break
        }
    }

    if (isNaN(total)) {
        const message = `🤬 numPages query failed: ${context}, ${category}, ${type}`
        Logger.error(message)
        throw new Error(message)
    }

    Logger.info(`🤟 numPages query has been finished`)
    return Math.ceil(total / PER_PAGE)
}

const countArchivePosts = async (
    slug: string,
    search: number,
    token: string,
): Promise<number> => {
    let filter: Record<string, unknown>
    if (search) {
        filter = {
            $text: { $search: slug },
        }
    } else {
        const archive = await getArchive(
            {
                slug,
                archiveType: ARCHIVE.CATEGORY,
                query: GQL_QUERY_TYPE.QUERY,
            },
            { token: '' },
        )
        filter = {
            archives: { $in: [new Types.ObjectId(archive[0]._id)] },
        }
    }

    if (!token) {
        filter.status = POST_STATUS.PUBLISH
    }

    return await Post.countDocuments(filter)
}
