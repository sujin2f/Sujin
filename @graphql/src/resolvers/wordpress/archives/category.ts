import sanitize from 'mongo-sanitize'
/* Models */
import { Logger } from '@sujin/share/model/Logger'
import { Archive } from '@src/schema/archive'
/* CONSTANTS */
import { ARCHIVE, COLLECTION } from '@sujin/lib/constants'
import { WEEK_IN_SECONDS } from '@sujin/share/constants/datetime'
/* T_Types */
import type { T_Archive } from '@sujin/lib/types'
/* Utils */
import { setCache } from '@src/utils/redis/cache'

/**
 * Load a category archive from MongoDB
 *
 * Throws a GraphQLError with `NO_CONTENT` when the archive is not found.
 */
export const category = async (_slug: string): Promise<T_Archive> => {
    const slug = sanitize(_slug)
    const result = await Archive.findOne({
        type: ARCHIVE.CATEGORY,
        slug,
    })
        .then((result) => {
            if (!result) {
                setCache(
                    JSON.stringify({ slug: '' }),
                    `${COLLECTION.ARCHIVE}-${ARCHIVE.CATEGORY}-${_slug}`,
                    WEEK_IN_SECONDS,
                )
                throw new Error(`🤬 Cannot find category ${slug}`)
            }
            return result.toObject()
        })
        .catch((e) => {
            Logger.error(e.message)
            throw e
        })

    setCache(JSON.stringify(result), `${COLLECTION.ARCHIVE}-${ARCHIVE.CATEGORY}-${_slug}`, WEEK_IN_SECONDS)
    Logger.info(`⭐️ category query done: ${slug}`)
    return result as unknown as T_Archive
}
