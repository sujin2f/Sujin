/* Models */
import { Background } from '@src/schema/background'
import { Logger } from '@sujin/share/model/Logger'
/* CONSTANTS */
import { COLLECTION } from '@sujin/lib/constants'
/* Utils */
import { cachedRequest, getCacheKey } from '@sujin/lib/utils/cache'
/* T_Types */
import type { T_Background } from '@sujin/lib/types'

/**
 * Return a cached sample of background images.
 *
 * Uses a MongoDB aggregation `$sample` to pick 10 backgrounds and caches the
 * result under the `COLLECTION.BACKGROUNDS` cache key.
 *
 * @returns An array of `T_Background` items.
 */
export const backgrounds = async (): Promise<T_Background[]> => {
    const request = cachedRequest(
        async (): Promise<T_Background[]> => await Background.aggregate<T_Background>([{ $sample: { size: 10 } }]),
        getCacheKey(COLLECTION.BACKGROUNDS),
    )
    const result = await request()
    Logger.info(`🤟 backgrounds query done`)
    return result
}
