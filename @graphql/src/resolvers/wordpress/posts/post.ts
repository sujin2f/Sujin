import sanitize from 'mongo-sanitize'
/* Models */
import { Logger } from '@common/model/Logger'
import { Post } from '@src/schema/post'
/* CONSTANTS */
import { COLLECTION, POST_STATUS } from '@common/constants'
import { AGGREGATE_EXPAND_ARCHIVES } from '@src/constants'
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
/* T_Types */
import type { T_Post } from '@common/types'
/* Utils */
import { setCache } from '@src/utils/redis/cache'

/**
 * Fetch a single published post by slug and expand related archive data.
 *
 * Uses an aggregation pipeline to expand archive references and throws a
 * GraphQLError with code `NO_CONTENT` when the post cannot be found.
 *
 * @param _slug - The post slug to fetch.
 * @returns The `T_Post` document for the requested slug.
 * @throws {GraphQLError} When the post is not found.
 */
export const post = async (_slug: string): Promise<T_Post> => {
    const slug = sanitize(_slug)
    const result = await Post.aggregate<T_Post>([
        {
            $match: { slug, status: POST_STATUS.PUBLISH },
        },
        ...AGGREGATE_EXPAND_ARCHIVES,
    ])
        .then((result) => {
            if (!result || !result.length) {
                setCache(JSON.stringify({ slug: '' }), `${COLLECTION.POST}-${_slug}`, WEEK_IN_SECONDS)
                throw new Error(`🤬 Cannot find the post ${slug}`)
            }
            Logger.info(`⭐️ post query done: ${slug}`)
            return result[0]
        })
        .catch((e) => {
            Logger.error(e.message)
            throw e
        })

    setCache(JSON.stringify(result), `${COLLECTION.POST}-${_slug}`, WEEK_IN_SECONDS)
    Logger.info(`⭐️ post query done: ${slug}`)
    return result
}
