import sanitize from 'mongo-sanitize'
/* Models */
import { Logger } from '@common/model/Logger'
import { Archive } from '@src/schema/archive'
/* CONSTANTS */
import { ARCHIVE, COLLECTION } from '@common/constants'
import { DAY_IN_SECONDS, WEEK_IN_SECONDS } from '@common/constants/datetime'
/* T_Types */
import type { T_Archive } from '@common/types'
/* Utils */
import { setCache } from '@src/utils/redis/cache'
import { updateCategory } from '@src/utils/redis/actions/updateCategory'

/**
 * Load a category archive from MongoDB
 *
 * Throws a GraphQLError with `NO_CONTENT` when the archive is not found.
 */
export const category = async (_slug: string): Promise<T_Archive> => {
    const slug = sanitize(_slug)
    const category = await Archive.findOne({
        type: ARCHIVE.CATEGORY,
        slug,
    })
        .then((result) => {
            if (!result) {
                return
            }
            return result.toObject()
        })
        .catch((e) => {
            Logger.error(`🤬 Error to retrieve category ${e.message}`)
            throw e
        })

    if (category) {
        setCache(JSON.stringify(category), `${COLLECTION.ARCHIVE}-${ARCHIVE.CATEGORY}-${_slug}`, WEEK_IN_SECONDS)
        Logger.info(`⭐️ category query done: ${slug}`)
        return category as unknown as T_Archive
    }

    const newCategory = await updateCategory(slug).catch(() => {
        setCache(JSON.stringify({ slug: '' }), `${COLLECTION.ARCHIVE}-${ARCHIVE.CATEGORY}-${_slug}`, DAY_IN_SECONDS)
        Logger.error(`🤬 Error to retrieve category from WP ${slug}`)
        throw new Error(`🤬 Error to retrieve category from WP ${slug}`)
    })

    setCache(JSON.stringify(newCategory), `${COLLECTION.ARCHIVE}-${ARCHIVE.CATEGORY}-${_slug}`, WEEK_IN_SECONDS)
    Logger.info(`⭐️ category query done: ${slug}`)
    return newCategory as unknown as T_Archive
}
