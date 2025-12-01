'server-only'
/* Models */
import { Logger } from '@sujin/share/model/Logger'
/* CONSTANTS */
import { DAY_IN_SECONDS } from '@sujin/share/constants/datetime'
/* Utils */
import { getClient } from '@lib/utils/redis'
import { IS_DEV } from '@sujin/share/constants/helper'

type redisCacheOption = {
    ttl?: number
    key: string
}
/**
 * Pass promise and keep it in Node cache
 *
 * @param promise Promise to execute
 * @param keys    Cache keys
 * @returns
 */
export const redisCachedRequest = async <T>(
    callback: () => Promise<T>,
    { ttl = DAY_IN_SECONDS, key }: redisCacheOption,
): Promise<T> => {
    const redis = await getClient().catch((e) => {
        Logger.error(`🤬 Redis connection failed: ${JSON.stringify(e)}`)
    })
    if (redis && key && !IS_DEV) {
        const result = await redis.get(`@next-${key}`)
        if (result) {
            return JSON.parse(result)
        }
    }

    return await callback().then(async (result) => {
        if (redis && key) {
            await redis
                .set(`@next-${key}`, JSON.stringify(result), {
                    EX: ttl,
                    NX: true,
                })
                .catch((e) => {
                    Logger.error(`🤬 Redis.set() failed: ${JSON.stringify(e)}`)
                })
        }
        return result
    })
}
