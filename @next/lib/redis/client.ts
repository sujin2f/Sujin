'server-only'
import { createClient, type RedisClientType } from 'redis'
/* Models */
import { Logger } from '@sujin/share/model/Logger'

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

/**
 * Pass promise and keep it in Redis
 * @next only uses get cache. Setting, deleting, and other cache controls are in @graphql
 *
 * @param promise Promise to execute
 * @param option  Cache key and ttl
 * @returns
 */
export const gqlRequest = async <T>(callback: () => Promise<T>, key: string): Promise<T> => {
    if (process.env.BYPASS_CACHE) {
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

    return await callback()
}

export const publish = async (channel: string, _message?: unknown) => {
    const redis = await client().catch((e) => {
        Logger.error(`🤬 Redis connection failed on publish: ${JSON.stringify(e)}`)
    })
    if (!redis || !redis.isReady) {
        Logger.error(`🤬 Redis does not exist or not ready on publish: ${JSON.stringify(redis)}`)
        return false
    }
    const publisher = await redis
        .duplicate()
        .connect()
        .catch((e) => {
            Logger.error(`🤬 Redis does not exist or not ready on publish: ${JSON.stringify(e)}`)
        })

    if (!publisher) {
        return false
    }

    const message = _message ? JSON.stringify(_message) : ''
    await publisher.publish(channel, message)
    publisher.destroy()
    return true
}
