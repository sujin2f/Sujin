/* Models */
import Logger from '@src/utils/logger'
import Cached from '@sujin/node-cache'
import { Background } from '@src/schema/background'
/* CONSTANTS */
import { COLLECTION } from '@sujin/lib/constants'
/* Utils */
import { getCacheKey } from '@sujin/lib/utils/cache'
import { verifyAdmin } from '@src/utils/security'
import { mysqlDisconnect } from '@src/utils/mysql'
import { convertWPImageURL } from '@src/utils/mongo/convertWPImageURL'
import { getBackgrounds } from '@src/utils/mysql/media'
/* T_Types */
import type { T_Background } from '@sujin/lib/types'

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
export const refreshBackgrounds = async (
    token: string,
): Promise<T_Background[]> => {
    verifyAdmin(
        token,
        'refreshBackground mutation has been called by non admin user',
    )
    await getBackgrounds().then(async (result) => {
        const backgrounds = result.map((image) => convertWPImageURL(image))
        await Background.deleteMany({})
        await Background.insertMany(backgrounds)
    })
    await mysqlDisconnect()
    await Cached.getInstance().flush(getCacheKey(COLLECTION.BACKGROUNDS))
    Logger.info(`🤟 refreshBackground mutation done`)
    return []
}
