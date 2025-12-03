'server-only'
/* CONSTANTS */
import { DAY_IN_SECONDS } from '@sujin/share/constants/datetime'
/* Models */
import { Logger } from '@sujin/share/model/Logger'
/* Utils */
import { createClient, type RedisClientType } from 'redis'

declare global {
    var redis: RedisClientType | void | null
}

const client = async (): Promise<RedisClientType | void> => {
    if (!process.env.REDIS_ENDPOINT) {
        return
    }

    if (global.redis && global.redis.isReady) {
        return global.redis
    }

    if (global.redis && !global.redis.isReady) {
        global.redis.destroy()
        global.redis = null
        return
    }

    global.redis = (await createClient({
        url: `redis://${process.env.REDIS_ENDPOINT}`,
    }).connect()) as RedisClientType
    return global.redis
}

export const removeCache = async (...keys: (string | number)[]): Promise<void> => {
    const redis = await client().catch((e) => {
        Logger.error(`🤬 Redis connection failed: ${JSON.stringify(e)}`)
    })
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

type CacheOption = {
    ttl?: number
    key: string
}
/**
 * Pass promise and keep it in Redis
 *
 * @param promise Promise to execute
 * @param option  Cache key and ttl
 * @returns
 */
export const gqlRequest = async <T>(
    callback: () => Promise<T>,
    { ttl = DAY_IN_SECONDS, key }: CacheOption,
): Promise<T> => {
    if (!!process.env.BYPASS_CACHE) {
        return await callback()
    }

    const redis = await client().catch((e) => {
        Logger.error(`🤬 Redis connection failed: ${JSON.stringify(e)}`)
    })

    if (!redis || !redis.isReady || !key) {
        return await callback()
    }

    const result = await redis.get(`@next-${key}`).catch((e) => {
        Logger.error(`🤬 Redis.get() failed: ${JSON.stringify(e)}`)
    })

    if (result) {
        // TODO check ttl and create background cache update
        return JSON.parse(result)
    }

    return await callback().then((result) => {
        redis
            .set(`@next-${key}`, JSON.stringify(result), {
                EX: ttl,
                NX: true,
            })
            .catch((e) => {
                Logger.error(`🤬 Redis.set() failed: ${JSON.stringify(e)}`)
            })
        return result
    })
}
