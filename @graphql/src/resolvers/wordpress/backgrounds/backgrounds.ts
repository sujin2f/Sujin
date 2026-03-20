/* Models */
import { Background } from '@src/schema/background'
import { Logger } from '@common/model/Logger'
/* T_Types */
import type { T_Background } from '@common/types'
/* Utils */
import { setCache } from '@src/utils/redis/cache'
/* CONSTANTS */
import { COLLECTION } from '@common/constants'
import { WEEK_IN_SECONDS } from '@common/constants/datetime'

/**
 * Return a cached sample of background images.
 *
 * Uses a MongoDB aggregation `$sample` to pick 10 backgrounds and caches the
 * result under the `COLLECTION.BACKGROUNDS` cache key.
 *
 * @returns An array of `T_Background` items.
 */
export const backgrounds = async (): Promise<T_Background[]> => {
    const result = await Background.aggregate<T_Background>([{ $sample: { size: 10 } }])
    setCache(JSON.stringify(result), COLLECTION.BACKGROUNDS, 42 * WEEK_IN_SECONDS)
    Logger.info(`⭐️ backgrounds query done`)
    return result
}
