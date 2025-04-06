import type NodeCache from 'node-cache'

import type { Nullable } from '../types'
import { Singleton } from './Singleton'
import { WEEK_IN_SECONDS } from '../constants/datetime'
import Logger from './Logger'

/**
 * Node Cache
 */
export default class Cached extends Singleton<Cached>() {
    private async getCache() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const cache = (global as any)['cache']
        if (cache) {
            return cache as NodeCache
        }

        Logger.server('NodeCache is not set.')
        const newCache = await this.init()
        if (!newCache) {
            console.error('NodeCache cannot be set.')
            throw Error('NodeCache cannot be set.')
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(global as any)['cache'] = newCache
        return newCache
    }

    constructor() {
        super()
        this.init()
    }

    public async init() {
        const NodeCache = (await import('node-cache')).default
        const cache = new NodeCache({ stdTTL: WEEK_IN_SECONDS })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(global as any)['cache'] = cache
        return cache
    }

    public async set<T>(key: string, value: T, ttl = WEEK_IN_SECONDS) {
        const cache = await this.getCache()
        cache.set<T>(key, value, ttl)
    }

    public async get<T>(key: string): Promise<Nullable<T>> {
        const cache = await this.getCache()
        return cache.get<T>(key)
    }

    public async getOrExecute<T>(
        key: string,
        callback: () => Promise<T>,
        ttl = WEEK_IN_SECONDS,
        force = false,
    ): Promise<T> {
        if (force) {
            return await callback()
        }

        const get = await this.get<T>(key)
        if (get) {
            return get
        }

        const result = await callback()

        await this.set(key, result, ttl)
        return result
    }

    public async del(key: string): Promise<void> {
        const cache = await this.getCache()
        cache.del(key)
    }

    public async flush(...keys: string[]): Promise<void> {
        const cache = await this.getCache()
        if (keys.length === 0) {
            cache.flushAll()
            return
        }
        cache.keys().forEach((v) =>
            keys.forEach((del) => {
                if (v.startsWith(del)) {
                    cache.del(del)
                }
            }),
        )
    }

    public async list(): Promise<string[]> {
        const cache = await this.getCache()
        return cache.keys()
    }
}
