/* Models */
import Logger from '@src/utils/logger'
import { Background } from '@src/schema/background'
/* CONSTANTS */
import { COLLECTION } from '@sujin/lib/types'
/* Utils */
import { cachedRequest, getCacheKey } from '@sujin/lib/utils/cache'
/* T_Types */
import type { T_Background } from '@sujin/lib/types'

/**
 * Get backgrounds
 * This returns the cached result if it exists
 *
 * @returns {Promise<T_Background[]>} - The background array
 */
export const getBackgrounds = async (): Promise<T_Background[]> => {
    const request = cachedRequest(query, getCacheKey(COLLECTION.BACKGROUNDS))
    const result = await request()
    Logger.info(`🤟 backgrounds query has been finished`)
    return result
}

const query = async (): Promise<T_Background[]> => {
    return await Background.aggregate<T_Background>([{ $sample: { size: 10 } }])
}
