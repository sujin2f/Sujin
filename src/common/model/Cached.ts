import NodeCache from 'node-cache'
import { DAY_IN_SECONDS } from 'src/common/constants/datetime'
import { Nullable } from 'src/common/types'
import { Singleton } from './Singleton'

/*
 * Node Cache
 */
export class Cached extends Singleton<Cached>() {
    private cache: NodeCache

    protected constructor() {
        super()
        this.cache = new NodeCache()
    }

    public set<T>(key: string, value: T, ttl = DAY_IN_SECONDS): void {
        this.cache.set<T>(key, value, ttl)
    }

    public get<T>(key: string): Nullable<T> {
        return this.cache.get<T>(key)
    }

    public async getOrExecute<T>(
        key: string,
        callback: () => Promise<T>,
        ttl = DAY_IN_SECONDS,
    ): Promise<T> {
        const get = this.get<T>(key)
        const result = get || (await callback())

        this.set<T>(key, result, ttl)
        return result
    }

    public del(key: string): void {
        this.cache.del(key)
    }
}
