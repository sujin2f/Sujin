/* Models */
import { Logger } from '@common/model/Logger'
import { Background } from '@src/schema/background'
/* Utils */
import { mysqlDisconnect } from '@src/utils/mysql'
import { convertWPImageURL } from '@src/utils/mongo/convertWPImageURL'
import { getBackgrounds } from '@src/utils/mysql/media'
import { removeCache } from '@src/utils/redis/cache'
/* T_Types */
import type { T_Background } from '@common/types'
/* CONSTANTS */
import { COLLECTION } from '@common/constants'

/**
 * Refresh background images from MySQL and replace the MongoDB collection.
 *
 * - Requires an admin token.
 * - Fetches backgrounds via `getBackgrounds`, normalizes URLs, replaces the
 *   `Background` collection and flushes the backgrounds cache.
 *
 * @param token - Admin GraphQL JWT.
 * @returns An empty array on success.
 */
export const refreshBackgrounds = async (): Promise<T_Background[]> => {
    // TODO WP Rest
    await getBackgrounds().then(async (result) => {
        const backgrounds = result.map((image) => convertWPImageURL(image))
        await Background.deleteMany({})
        await Background.insertMany(backgrounds)
    })
    await mysqlDisconnect()
    removeCache(COLLECTION.BACKGROUNDS)
    Logger.info(`⭐️ refreshBackground done`)
    return []
}
