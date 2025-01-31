import NodeCache from 'node-cache'

import type { Nullable } from '../types'
import { Singleton } from './Singleton'
import { DAY_IN_SECONDS } from '../constants/datetime'

/**
 * Node Cache
 */
export class Cached extends Singleton<Cached>() {
    private cache: Nullable<NodeCache>

    protected constructor() {
        super()
        this.init()
    }

    private async init() {
        const NodeCache = (await import('node-cache')).default
        this.cache = new NodeCache()
    }

    public set<T>(key: string, value: T, ttl = DAY_IN_SECONDS) {
        if (!this.cache) {
            throw Error('NodeCache is not set.')
        }
        this.cache.set<T>(key, value, ttl)
    }

    public get<T>(key: string): Nullable<T> {
        if (!this.cache) {
            return undefined
        }
        return this.cache.get<T>(key)
    }

    public async getOrExecute<T>(
        key: string,
        callback: () => Promise<T>,
        ttl = DAY_IN_SECONDS,
        force = false,
    ): Promise<T> {
        if (force) {
            return await callback()
        }

        const get = this.get<T>(key)
        if (get) {
            return get
        }

        const result = await callback()

        this.set(key, result, ttl)
        return result
    }

    public del(key: string): void {
        if (!this.cache) {
            throw Error('NodeCache is not set.')
        }
        this.cache.del(key)
    }

    public flush(): void {
        if (!this.cache) {
            throw Error('NodeCache is not set.')
        }
        this.cache.flushAll()
    }
}
