'server-only'
import { createClient } from 'redis'

declare global {
    var redis: Awaited<ReturnType<typeof connect>> | void
}

export const getClient = async () => {
    if (global.redis) {
        return redis
    }

    global.redis = await connect()
    return global.redis
}

const connect = async () => {
    if (!process.env.REDIS_SERVER) {
        return
    }
    return await createClient({
        url: `redis://${process.env.REDIS_SERVER}`,
    }).connect()
}

export const removeCache = async (...keys: (string | number)[]): Promise<void> => {
    const redis = await getClient()
    if (!redis) {
        return
    }

    // When key is empty, delete everything
    if (!keys.length) {
        const match = await redis.keys('@next-*')
        for await (const key of match) {
            await redis.del(key)
        }
        return
    }

    const match = await redis.keys(`@next-${keys.join('-')}*`)
    for await (const key of match) {
        await redis.del(key)
    }
}
