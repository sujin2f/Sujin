import sanitize from 'mongo-sanitize'
/* Models */
import { Logger } from '@sujin/share/model/Logger'
import { Page } from '@src/schema/post'
/* CONSTANTS */
import { COLLECTION, POST_STATUS } from '@sujin/lib/constants'
import { WEEK_IN_SECONDS } from '@sujin/share/constants/datetime'
/* T_Types */
import type { T_Page } from '@sujin/lib/types'
/* Utils */
import { setCache } from '@src/utils/redis/cache'

/**
 * Fetch a published page by slug, using a cached request wrapper.
 *
 * Throws a `GraphQLError` with code `NO_CONTENT` if the page cannot be found.
 *
 * @param _slug - The page slug to fetch.
 * @returns The `T_Page` document.
 */
export const page = async (_slug: string): Promise<T_Page> => {
    const slug = sanitize(_slug)

    const result = await Page.findOne({
        slug,
        status: POST_STATUS.PUBLISH,
    })
        .then((result) => {
            if (!result) {
                setCache(JSON.stringify({ slug: '' }), `${COLLECTION.PAGE}-${_slug}`, WEEK_IN_SECONDS)
                throw new Error(`🤬 Cannot find the page ${slug}`)
            }

            Logger.info(`⭐️ page query done: ${slug}`)
            return result.toObject() as unknown as T_Page
        })
        .catch((e) => {
            Logger.error(e.message)
            throw e
        })
    setCache(JSON.stringify(result), `${COLLECTION.PAGE}-${_slug}`, WEEK_IN_SECONDS)
    Logger.info(`⭐️ page query done: ${slug}`)
    return result
}
