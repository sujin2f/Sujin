import NodeCache from 'node-cache'

import type { Nullable } from '../types'
import { Singleton } from './Singleton'
import { NodeModuleError } from './Error'

/**
 * Node Cache
 */
export default class Cached extends Singleton<Cached>() {
    /**
     * Gets or creates the cache instance.
     * @returns {Promise<NodeCache>} The cache instance.
     * @throws {NodeModuleError} If NodeCache cannot be initialized.
     * @private
     */
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

    /**
     * Initializes the cache instance.
     */
    constructor() {
        super()
        this.init()
    }

    /**
     * Initializes the NodeCache instance.
     * @returns {Promise<NodeCache>} The initialized cache instance.
     */
    public async init() {
        const cache = new NodeCache()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(global as any)['cache'] = cache
        return cache
    }

    /**
     * Sets a value in the cache with an optional TTL.
     * @template T The type of the value being cached.
     * @param {string} key The cache key.
     * @param {T} value The value to cache.
     * @param {number} [ttl=0] The time-to-live in seconds (0 = no expiration).
     * @returns {Promise<void>}
     */
    public async set<T>(key: string, value: T, ttl = 0) {
        try {
            const cache = await this.getCache()
            cache.set<T>(key, value, ttl)
        } finally {
            /* empty */
        }
    }

    /**
     * Gets a value from the cache.
     * @template T The type of the cached value.
     * @param {string} key The cache key.
     * @returns {Promise<Nullable<T>>} The cached value or undefined if not found or expired.
     */
    public async get<T>(key: string): Promise<Nullable<T>> {
        try {
            const cache = await this.getCache()
            return cache.get<T>(key)
        } catch {
            return undefined
        }
    }

    /**
     * Gets a cached value or executes a callback if the value is not cached.
     * @template T The type of the value.
     * @param {string} key The cache key.
     * @param {Promise<T>} callback The callback to execute if cache miss.
     * @param {Object} [option] Cache options.
     * @param {number} [option.ttl=0] The time-to-live in seconds.
     * @param {boolean} [option.force=false] Force execution of callback and update cache.
     * @returns {Promise<T>} The cached or freshly computed value.
     */
    public async getOrExecute<T>(
        key: string,
        callback: Promise<T>,
        option: { ttl?: number; force?: boolean } = {
            ttl: 0,
            force: false,
        },
    ): Promise<T> {
        if (option.force) {
            return await callback
        }

        const get = await this.get<T>(key)
        if (get) {
            return get
        }

        const result = await callback
        await this.set(key, result, option.ttl)
        return result
    }

    /**
     * Flushes cache entries by key prefix or all entries if no keys provided.
     * @param {...string[]} keys The key prefixes to flush (no args = flush all).
     * @returns {Promise<void>}
     */
    public async flush(...keys: string[]): Promise<void> {
        try {
            const cache = await this.getCache()
            if (keys.length === 0) {
                cache.flushAll()
                return
            }
            cache.keys().forEach((key) =>
                keys.forEach((del) => {
                    if (key.startsWith(del)) {
                        cache.del(key)
                    }
                }),
            )
        } finally {
            /* empty */
        }
    }

    /**
     * Lists all cache keys.
     * @returns {Promise<string[]>} Array of cache keys or empty array on error.
     */
    public async list(): Promise<string[]> {
        try {
            const cache = await this.getCache()
            return cache.keys()
        } catch {
            return []
        }
    }
}
