import type { RootFilterQuery } from 'mongoose'
import { GraphQLError } from 'graphql'
import sanitize from 'mongo-sanitize'
/* Models */
import Logger from '@src/utils/logger'
import { Post } from '@src/schema/post'
/* CONSTANTS */
import { POST_TYPE, COLLECTION, POST_STATUS } from '@sujin/lib/constants'
import { AGGREGATE_EXPAND_ARCHIVES } from '@src/constants'
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
export const post = async (
    _slug: string,
    isAdmin: boolean,
    token: string,
): Promise<T_Post> => {
    const slug = sanitize(_slug)
    type Match = RootFilterQuery<T_Page>
    const $match: Match = { slug }

    if (isAdmin)
        verifyAdmin(token, 'post query has been called by non admin user')

    if (!isAdmin) $match.status = POST_STATUS.PUBLISH

    const callback = async (): Promise<T_Post> => {
        return await Post.aggregate<T_Post>([
            {
                $match,
            },
            ...AGGREGATE_EXPAND_ARCHIVES,
        ]).then((result) => {
            if (!result || !result.length) {
                throw new GraphQLError(`Cannot find the post ${slug}`, {
                    extensions: {
                        code: 'NO_CONTENT',
                    },
                })
            }
            return result[0]
        })
    }

    const request = isAdmin
        ? callback
        : cachedRequest(
              callback,
              getCacheKey(COLLECTION.POST, slug, POST_TYPE.POST),
          )
    const result = await request()

    Logger.info(`🤟 post query done: ${slug}`)
    return result
}
