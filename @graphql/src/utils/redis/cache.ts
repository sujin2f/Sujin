'server-only'
/* CONSTANTS */
import { DAY_IN_SECONDS } from '@sujin/share/constants/datetime'
/* Models */
import { Logger } from '@sujin/share/model/Logger'
/* Utils */
import { createClient } from 'redis'

export const removeCache = async (...keys: (string | number)[]): Promise<void> => {
    const redis = await createClient({
        url: `redis://${process.env.REDIS_ENDPOINT}`,
    }).connect()

    if (!redis || !redis.isReady) {
        return
    }

    // When key is empty, delete everything
    const match = !keys.length ? await redis.keys('@next-*') : await redis.keys(`@next-${keys.join('-')}*`)
    const promises = []
    for await (const key of match) {
        promises.push(redis.del(key))
    }
    await Promise.allSettled(promises)
    redis.destroy()
}

/**
 * Pass promise and keep it in Redis
 * @next only uses get cache. Setting, deleting, and other cache controls are in @graphql
 *
 * @param promise Promise to execute
 * @param option  Cache key and ttl
 * @returns
 */
export const setCache = async (data: string, key: string, ttl: number = DAY_IN_SECONDS): Promise<void> => {
    const redis = await createClient({
        url: `redis://${process.env.REDIS_ENDPOINT}`,
    }).connect()

    if (!redis || !redis.isReady) {
        return
    }

    await redis
        .set(`@next-${key}`, data, {
            EX: ttl,
            NX: true,
        })
        .catch((e) => {
            Logger.error(`🤬 Redis.set() failed: ${JSON.stringify(e)}`)
        })
    redis.destroy()
}
