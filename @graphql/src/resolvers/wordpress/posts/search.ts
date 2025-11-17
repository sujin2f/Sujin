import { type RootFilterQuery } from 'mongoose'
import { GraphQLError } from 'graphql'
import sanitize from 'mongo-sanitize'
/* Models */
import Logger from '@src/utils/logger'
import { Post } from '@src/schema/post'
/* CONSTANTS */
import { PER_PAGE, COLLECTION, POST_STATUS } from '@sujin/lib/constants'
import {
    AGGREGATE_ARCHIVE_POST,
    AGGREGATE_EXPAND_ARCHIVES,
} from '@src/constants'
/* Utils */
import { cachedRequest, getCacheKey } from '@sujin/lib/utils/cache'
import { verifyAdmin } from '@src/utils/mongo/security'
/* T_Types */
import type { T_Page, T_Post } from '@sujin/lib/types'

/**
 * Get/Update/Remove post(s)
 *
 * @returns {Promise<T_Post[]>}
 */
export const search = async (
    _keyword: string,
    _page: number,
    isAdmin: boolean,
    token: string,
): Promise<T_Post[]> => {
    const keyword = sanitize(_keyword)
    const page = sanitize(_page)

    type Match = RootFilterQuery<T_Page>
    const $match: Match = {}

    if (isAdmin)
        verifyAdmin(token, 'post search has been called by non admin user')

    if (!isAdmin) $match.status = POST_STATUS.PUBLISH

    $match['$text'] = { $search: keyword }

    const callback = async (): Promise<T_Post[]> =>
        await Post.aggregate<T_Post>([
            { $match },
            { $sort: { date: -1 } },
            { $skip: PER_PAGE * (page - 1) },
            { $limit: PER_PAGE },
            ...AGGREGATE_EXPAND_ARCHIVES,
            ...AGGREGATE_ARCHIVE_POST,
        ]).then((result) => {
            if (!result || !result.length) {
                throw new GraphQLError(
                    `Cannot find the post from search: ${keyword}, ${page}`,
                    {
                        extensions: {
                            code: 'NO_CONTENT',
                        },
                    },
                )
            }
            return result
        })

    const request = isAdmin
        ? callback
        : cachedRequest(
              callback,
              getCacheKey(COLLECTION.POST, 'search', keyword, page),
          )
    const result = await request()

    Logger.info(`🤟 post search done: ${keyword}, ${page}`)
    return result
}
