import { DAY_IN_SECONDS, SECOND_IN_MS } from '@common/constants/datetime'
import Mongo from '@common/data/mongo/mongo'
import type {
    Document,
    ObjectId,
    WithId,
    Filter,
    InsertOneResult,
} from 'mongodb'

/**
 * Cached data for expiration collection.
 * Use this for multiple results that need to be cleared at once.
 * Do not use this for a single result like a post that causes a house keeping problem.
 */

type Cached = {
    collection: string
    key: string
    expire: number
    items: ObjectId[]
}

/**
 * Inserts a single cache entry into the expiration collection.
 *
 * @param {string} collection - The name of the collection.
 * @param {string} key - The cache key.
 * @param {ObjectId[]} items - The ObjectIds to cache.
 * @param {number} [ttl=DAY_IN_SECONDS] - The time-to-live (TTL) for the cache entry in seconds.
 * @returns {Promise<InsertOneResult<Cached>>} The result of the insert operation.
 */
const replaceOne = async (
    collection: string,
    key: string,
    items: ObjectId[],
    ttl: number = DAY_IN_SECONDS,
): Promise<InsertOneResult<Cached>> => {
    // Delete old cache
    await Mongo.deleteMany('expiration', {
        collection,
        key,
    })
    return await Mongo.insertOne<Cached>('expiration', {
        collection,
        key,
        items,
        expire: Date.now() / SECOND_IN_MS + ttl,
    })
}

/**
 * Finds a single cache entry in the expiration collection.
 *
 * @template T - The type of the document.
 * @param {string} collection - The name of the collection.
 * @param {string} key - The cache key.
 * @returns {Promise<[WithId<T>[], boolean]>} The found documents and a boolean indicating if the cache is expired.
 */
const findOne = async <T extends Document>(
    collection: string,
    key: string,
): Promise<[WithId<T>[], boolean]> => {
    try {
        const expiration = await Mongo.findOne<Cached>('expiration', {
            collection,
            key,
        })

        // Find actual data from cached IDs
        const result = await Mongo.findMany<T>(collection, {
            _id: { $in: expiration.items },
        } as Filter<T>)

        // Check if the cache is not expired
        if (expiration.expire > Date.now() / SECOND_IN_MS) {
            return [result, false]
        }

        // Cache is expired
        return [result, true]
    } catch {
        // Cache does not exist
        return [[], true]
    }
}

/**
 * Requests cached data.
 *
 * @template T - The type of the documents.
 * @param {string} collection - The collection to be store.
 * @param {Filter<T>} doc - The filter to apply to the query.
 * @param {(doc: Filter<T>) => Promise<WithId<T>[]>} requestCallBack - Database or API call.
 * @param {number} ttl - Caching time.
 * @returns {Promise<WithId<T>[]>} The result data.
 */
export const getCachedData = async <T extends Document>(
    collection: string,
    doc: Filter<T>,
    requestCallBack: (doc: Filter<T>) => Promise<WithId<T>[]>,
    ttl: number = DAY_IN_SECONDS,
): Promise<WithId<T>[]> => {
    const cacheKey = `${collection}-${JSON.stringify(doc)
        .toLowerCase()
        .replaceAll('"', '')}`

    // Request cached value
    const cashed = await findOne<T>(collection, cacheKey)
        .then(async (result) => {
            // When expired
            if (result[1]) {
                // Request API, does not wait
                requestCallBack(doc).then(async (items: WithId<T>[]) => {
                    if (items.length) {
                        replaceOne(
                            collection,
                            cacheKey,
                            items.map((item) => item._id),
                            ttl,
                        )
                    }
                })
            }
            return result[0]
        })
        // When cached value does not exist, request and save
        .catch(async () => {
            const result = await requestCallBack(doc)
            if (result.length) {
                replaceOne(
                    collection,
                    cacheKey,
                    result.map((item) => item._id),
                    ttl,
                )
            }
            return result
        })

    return cashed
}
