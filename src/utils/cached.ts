import NodeCache from 'node-cache'
import { DAY_IN_SECONDS } from 'src/common/constants/datetime'
import { Nullable } from 'src/types/common'
import { isDev } from './environment'

export class Cached {
    private cache: NodeCache
    private static _instance: Cached
    public static FAILED = 'FAILED TO CACHE'

    public static getInstance(): Cached {
        return this._instance || (this._instance = new this())
    }

    constructor() {
        this.cache = new NodeCache()
    }

    public set<T>(key: string, value: Nullable<T>, ttl = DAY_IN_SECONDS): void {
        if (!value) {
            this.cache.set<string>(key, Cached.FAILED, ttl)
            return
        }
        this.cache.set<T>(key, value, ttl)
    }

    public get<T>(key: string): Nullable<T> {
        if (isDev) {
            return
        }
        return this.cache.get<T>(key)
    }

    public async getOrExecute<T>(
        key: string,
        callback: () => Promise<Nullable<T>>,
        ttl = DAY_IN_SECONDS,
    ): Promise<T> {
        if (isDev) {
            return (await callback()) || (Cached.FAILED as unknown as T)
        }

        const get = this.get<T>(key)
        const result = get || (await callback())

        if (!result) {
            this.set<string>(key, Cached.FAILED, ttl)
            return Cached.FAILED as unknown as T
        }

        this.set<T>(key, result, ttl)
        return result
    }

    public del(key: string): void {
        this.cache.del(key)
    }

    public isFailed(value: any): boolean {
        return value === Cached.FAILED
    }
}
