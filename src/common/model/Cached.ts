import NodeCache from 'node-cache'
import { DAY_IN_SECONDS } from 'src/common/constants/datetime'
import type { Nullable } from 'src/common/types'
import { Singleton } from './Singleton'

/*
 * Node Cache
 */
export class Cached extends Singleton<Cached>() {
    private readonly cache: NodeCache
    public static readonly FAILED = 'FAILED TO CACHE'

    protected constructor() {
        super()
        this.cache = new NodeCache()
    }

    public set<T>(key: string, value: T, ttl = DAY_IN_SECONDS) {
        if (!value) {
            this.cache.set<string>(key, Cached.FAILED, ttl)
            return
        }
        this.cache.set<T>(key, value, ttl)
    }

    public get<T>(key: string): Nullable<T> {
        return this.cache.get<T>(key)
    }

    public async getOrExecute<T>(
        key: string,
        callback: () => Promise<Nullable<T>>,
        force = false,
        ttl = DAY_IN_SECONDS,
    ): Promise<T> {
        if (force) {
            return (await callback()) || (Cached.FAILED as unknown as T)
        }

        const get = this.get<T>(key)
        const result = get || (await callback())

        if (!result) {
            this.set<string>(key, Cached.FAILED, ttl)
            return Cached.FAILED as unknown as T
        }

        if (!get) {
            this.set<T>(key, result, ttl)
        }

        return result
    }

    public del(key: string): void {
        this.cache.del(key)
    }

    public isFailed(value: unknown): boolean {
        return value === Cached.FAILED
    }
}
