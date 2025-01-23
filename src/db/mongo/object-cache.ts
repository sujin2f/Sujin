import { DAY_IN_SECONDS, SECOND_IN_MS } from '@common/constants/datetime'
import Mongo from '@common/data/mongo-connect'
import type { Document, ObjectId, WithId, Filter } from 'mongodb'

type Cached = {
    collection: string
    key: string
    expire: number
    items: ObjectId[]
}

const insertOne = async (
    collection: string,
    key: string,
    items: ObjectId[],
    ttl = DAY_IN_SECONDS,
) => {
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

const findOne = async <T extends Document>(
    collection: string,
    key: string,
): Promise<[WithId<T>[], boolean]> =>
    await Mongo.findOne<Cached>('expiration', { collection, key }).then(
        async (expiration) => {
            const result = await Mongo.findMany<T>(collection, {
                _id: { $in: expiration.items },
            } as Filter<T>)
            if (expiration.expire > Date.now() / SECOND_IN_MS) {
                return [result, false]
            }

            return [result, true]
        },
    )

/**
 * Requests cached data.
 *
 * @template T - The type of the documents.
 * @param {string} collection - The collection to be store.
 * @param {Filter<T>} doc - The filter to apply to the query.
 * @param {(doc: Filter<T>) => Promise<T[]>} requestCallBack - Database or API call.
 * @param {number} ttl - Caching time.
 * @returns {Promise<WithId<T>[]>} The result data.
 */
export const getCachedData = async <T extends Document>(
    collection: string,
    doc: Filter<T>,
    requestCallBack: (doc: Filter<T>) => Promise<void>,
    ttl: number = DAY_IN_SECONDS,
): Promise<WithId<T>[]> => {
    const cacheKey = `${collection}-${JSON.stringify(doc)
        .toLowerCase()
        .replaceAll('"', '')}`

    // Request cached value
    const [cashed] = await findOne<T>(collection, cacheKey)
        .then((result) => {
            // When expired, update cache
            if (result[1]) {
                requestCallBack(doc).then(async () => {
                    const result = await Mongo.findMany<T>(
                        collection,
                        doc,
                    ).catch(() => [] as WithId<T>[])

                    if (result.length) {
                        insertOne(
                            collection,
                            cacheKey,
                            result.map((item) => item._id),
                            ttl,
                        )
                    }
                })
            }
            return result
        })
        .catch(async () => {
            // When cached value does not exist, request flickr.com and save
            await requestCallBack(doc)
            const result = await Mongo.findMany<T>(collection, doc).catch(
                () => [] as WithId<T>[],
            )
            if (result.length) {
                insertOne(
                    collection,
                    cacheKey,
                    result.map((item) => item._id),
                    ttl,
                )
            }
            return [result, false] as [WithId<T>[], boolean]
        })

    return cashed
}

const actions = {
    findOne,
    insertOne,
}

export default actions
