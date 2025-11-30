'server-only'
import { createClient } from 'redis'

declare global {
    var redis: Awaited<ReturnType<typeof connect>> | null
}

export const getClient = async () => {
    if (global.redis) {
        return redis
    }

    global.redis = await connect()
    return global.redis
}

const connect = async () => {
    return await createClient({
        url: 'redis://:eYVX7EwVmmxKPCDmwMtyKVge8oLd2t81@localhost:6379',
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
        console.log(key)
        await redis.del(key)
    }
}
