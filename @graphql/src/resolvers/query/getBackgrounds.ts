/* Models */
import Logger from '@src/utils/logger'
import { Background } from '@src/schema/background'
/* CONSTANTS */
import { COLLECTION } from '@sujin/lib/constants'
/* Utils */
import { cachedRequest, getCacheKey } from '@sujin/lib/utils/cache'
/* T_Types */
import type { T_Background } from '@sujin/lib/types'
import { Context } from '@src/types'
import { verifyAdmin } from '@src/utils/mongo/verifyUser'

type Param = {
    bypassCache: boolean
}

/**
 * Get backgrounds
 * This returns the cached result if it exists
 *
 * @returns {Promise<T_Background[]>} - The background array
 */
export const getBackgrounds = async (
    _: unknown,
    { bypassCache }: Param,
    context: Context,
): Promise<T_Background[]> => {
    let request: typeof query

    if (bypassCache) {
        if (!(await verifyAdmin(context.token))) {
            Logger.error(
                `⛈️ getBackgrounds query has been called by non admin user`,
            )
            throw new Error(
                `⛈️ getBackgrounds query has been called by non admin user`,
            )
        }

        request = query
    } else {
        request = cachedRequest(query, getCacheKey(COLLECTION.BACKGROUNDS))
    }

    const result = await request()
    Logger.info(`🤟 getBackgrounds query has been finished`)
    return result
}

const query = async (): Promise<T_Background[]> => {
    return await Background.aggregate<T_Background>([{ $sample: { size: 10 } }])
}
