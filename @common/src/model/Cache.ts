// import NodeCache from 'node-cache'

// import type { Nullable } from '../types'
// import { Singleton } from './Singleton'
// import { NodeModuleError } from './Error'

// /**
//  * Node Cache
//  */
// export default class Cached extends Singleton<Cached>() {
//     private _cached: Nullable<NodeCache>
//     private get cached(): NodeCache {
//         if (this._cached) {
//             return this._cached
//         }

//         this._cached = new NodeCache()
//         if (!this._cached) {
//             throw new NodeModuleError('NodeCache cannot be set.')
//         }
//         return this._cached
//     }

//     /**
//      * Initializes the cache instance.
//      */
//     constructor() {
//         super()
//         this._cached = new NodeCache()
//     }

//     /**
//      * Sets a value in the cache with an optional TTL.
//      * @template T The type of the value being cached.
//      * @param {string} key The cache key.
//      * @param {T} value The value to cache.
//      * @param {number} [ttl=0] The time-to-live in seconds (0 = no expiration).
//      */
//     public set<T>(key: string, value: T, ttl: number = 0) {
//         try {
//             this.cached.set<T>(key, value, ttl)
//             // eslint-disable-next-line no-console
//             console.info(`⭐️ cache set is done! ${key}`)
//         } catch (e) {
//             // eslint-disable-next-line no-console
//             console.error(`🤬 Setting cache failed! ${JSON.stringify(e)}`)
//             /* empty */
//         } finally {
//             /* empty */
//         }
//     }

//     /**
//      * Gets a value from the cache.
//      * @template T The type of the cached value.
//      * @param {string} key The cache key.
//      * @returns {Nullable<T>} The cached value or undefined if not found or expired.
//      */
//     public get<T>(key: string): Nullable<T> {
//         try {
//             return this.cached.get<T>(key)
//         } catch {
//             return undefined
//         }
//     }

//     /**
//      * Gets a cached value or executes a callback if the value is not cached.
//      * @template T The type of the value.
//      * @param {string} key The cache key.
//      * @param {Promise<T>} callback The callback to execute if cache miss.
//      * @param {Object} [option] Cache options.
//      * @param {number} [option.ttl=0] The time-to-live in seconds.
//      * @param {boolean} [option.force=false] Force execution of callback and update cache.
//      * @returns {Promise<T>} The cached or freshly computed value.
//      */
//     public async getOrExecute<T>(
//         key: string,
//         callback: Promise<T>,
//         option: { ttl?: number; force?: boolean } = {
//             ttl: 0,
//             force: false,
//         },
//     ): Promise<T> {
//         if (option.force) {
//             return await callback
//         }

//         const get = this.get<T>(key)
//         if (get) {
//             return get
//         }

//         const result = await callback
//         this.set<T>(key, result, option.ttl)
//         return result
//     }

//     /**
//      * Flushes cache entries by key prefix or all entries if no keys provided.
//      * @param {...string[]} keys The key prefixes to flush (no args = flush all).
//      */
//     public flush(...keys: string[]) {
//         try {
//             if (keys.length === 0) {
//                 this.cached.flushAll()
//                 return
//             }
//             this.cached.keys().forEach((key) =>
//                 keys.forEach((del) => {
//                     if (key.startsWith(del)) {
//                         this.cached.del(key)
//                     }
//                 }),
//             )
//         } finally {
//             /* empty */
//         }
//     }

//     /**
//      * Lists all cache keys.
//      * @returns {string[]} Array of cache keys or empty array on error.
//      */
//     public list(): string[] {
//         try {
//             return this.cached.keys()
//         } catch {
//             return []
//         }
//     }
// }
