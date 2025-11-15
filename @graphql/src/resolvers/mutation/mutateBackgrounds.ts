/* Models */
import Logger from '@src/utils/logger'
import Cached from '@sujin/node-cache'
import { mysqlDisconnect } from '@src/utils/mysql'
import { Background } from '@src/schema/background'
/* CONSTANTS */
import { COLLECTION } from '@sujin/lib/constants'
/* Utils */
import { getCacheKey } from '@sujin/lib/utils/cache'
import { getBackgrounds } from '@src/utils/mysql/media'
import { convertWPImageURL } from '@src/utils/mongo/convertWPImageURL'
import { verifyAdmin } from '@src/utils/mongo/verifyUser'
/* T_Types */
import type { MutationResultType } from '@src/types'
import type { Context } from '@src/types'

/**
 * Update backgrounds from MySQL
 * @returns {Promise<T_Background[]>} - The background array
 * @throws
 */
const updateBackgrounds = async (): Promise<void> => {
    Cached.getInstance().flush(getCacheKey(COLLECTION.BACKGROUNDS))
    await getBackgrounds().then(async (result) => {
        const backgrounds = result.map((image) => convertWPImageURL(image))
        await Background.deleteMany({})
        await Background.insertMany(backgrounds)
    })
    await mysqlDisconnect()
}

/**
 * Update Mongo Post type from MySQL for GraphQL
 *
 * @param {string} nonce - WP nonce
 * @returns {Promise<MutationResultType>}
 */
export const mutateBackgrounds = async (
    _: unknown,
    __: unknown,
    context: Context,
): Promise<MutationResultType> => {
    if (!(await verifyAdmin(context.token))) {
        Logger.error(
            `⛈️ mutateBackgrounds mutation has been called by non admin user`,
        )
        throw new Error(
            `⛈️ mutateBackgrounds mutation has been called by non admin user`,
        )
    }

    await updateBackgrounds()
    Logger.info(`🤟 mutateBackgrounds mutation has been requested`)
    return {
        result: true,
    }
}
