import type NodeCache from 'node-cache'

import type { Nullable } from '../types'
import { Singleton } from './Singleton'
import { NodeModuleError } from './Error'

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

        const newCache = await this.init()
        if (!newCache) {
            throw new NodeModuleError('NodeCache cannot be set.')
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
        const cache = new NodeCache()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(global as any)['cache'] = cache
        return cache
    }

    public async set<T>(key: string, value: T, ttl = 0) {
        try {
            const cache = await this.getCache()
            cache.set<T>(key, value, ttl)
        } finally {
        }
    }

    public async get<T>(key: string): Promise<Nullable<T>> {
        try {
            const cache = await this.getCache()
            return cache.get<T>(key)
        } finally {
            return undefined
        }
    }

    public async getOrExecute<T>(
        key: string,
        callback: () => Promise<T>,
        ttl = 0,
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

    public async flush(...keys: string[]): Promise<void> {
        try {
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
        } finally {
        }
    }

    public async list(): Promise<string[]> {
        try {
            const cache = await this.getCache()
            return cache.keys()
        } finally {
            return []
        }
    }
}
