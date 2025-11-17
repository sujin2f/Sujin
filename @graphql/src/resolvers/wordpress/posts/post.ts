import { GraphQLError } from 'graphql'
import sanitize from 'mongo-sanitize'
/* Models */
import Logger from '@src/utils/logger'
import { Post } from '@src/schema/post'
/* CONSTANTS */
import { COLLECTION, POST_STATUS } from '@sujin/lib/constants'
import { AGGREGATE_EXPAND_ARCHIVES } from '@src/constants'
/* Utils */
import { cachedRequest, getCacheKey } from '@sujin/lib/utils/cache'
/* T_Types */
import type { T_Post } from '@sujin/lib/types'

/**
 * Get/Update/Remove post(s)
 *
 * @returns {Promise<T_Post[]>}
 */
export const post = async (_slug: string): Promise<T_Post> => {
    const slug = sanitize(_slug)

    const request = cachedRequest(async (): Promise<T_Post> => {
        return await Post.aggregate<T_Post>([
            {
                $match: { slug, status: POST_STATUS.PUBLISH },
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
    }, getCacheKey(COLLECTION.POST, slug))
    const result = await request()
    Logger.info(`🤟 post query done: ${slug}`)
    return result
}
