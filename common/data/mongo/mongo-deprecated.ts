import { InsertManyResult } from 'mongodb'
import type {
    Sort,
    Document,
    Filter,
    InsertOneResult,
    OptionalUnlessRequiredId,
    WithId,
    DeleteResult,
    UpdateResult,
    MongoClient,
    UpdateFilter,
} from 'mongodb'
/* Models */
import client from './mongo'
/* Utils */
import { compareVersions } from '../../utils/system'
/* CONSTANTS */
import { IS_TEST, MONGO_DATABASE } from '@common/constants/helper'
import Logger from '@common/model/Logger'

const suffix = IS_TEST ? `-${process.env.JEST_WORKER_ID}` : ''

/**
 * Finds a single document in a MongoDB collection.
 *
 * @template T - The type of the document.
 * @param {string} collection - The name of the collection.
 * @param {Filter<T>} doc - The filter to apply to the query.
 * @returns {Promise<WithId<T>>} The found document or undefined if not found.
 * @throws {Error} If the document is not found.
 * @deprecated use collection
 */
const findOne = async <T extends Document>(
    collection: string,
    doc: Filter<T>,
): Promise<WithId<T>> => {
    return await client.then(async (client) => {
        const database = client.db(MONGO_DATABASE)

        const result = await database
            .collection<T>(`${collection}${suffix}`)
            .findOne(doc)

        if (!result) {
            throw Error(
                `Mongo findOne failed to fetch database collection ${collection}${suffix} with a document ${JSON.stringify(
                    doc,
                )}`,
            )
        }

        return result
    })
}

type findManyOptions = {
    sort?: Sort
    limit?: number
    skip?: number
}
/**
 * Finds multiple documents in a MongoDB collection.
 *
 * @template T - The type of the documents.
 * @param {string} collection - The name of the collection.
 * @param {Filter<T>} doc - The filter to apply to the query.
 * @param {findManyOptions} options - The options to apply to the query.
 * @returns {Promise<(WithId<T> | T)[]>} The found documents or an empty array if none found.
 * @deprecated use collection
 */
const findMany = async <T extends Document>(
    collection: string,
    doc: Filter<T>,
    options?: findManyOptions,
): Promise<WithId<T>[]> => {
    return await client.then(async (client) => {
        const database = client.db(MONGO_DATABASE)
        let find = database.collection<T>(`${collection}${suffix}`).find(doc)
        if (options && options.sort) {
            find = find.sort(options.sort)
        }
        if (options && options.skip) {
            find = find.skip(options.skip)
        }
        if (options && options.limit) {
            find = find.limit(options.limit)
        }
        return await find.toArray()
    })
}

const random = async <T extends Document>(
    collection: string,
    size: number,
): Promise<T[]> => {
    return await client.then(async (client) => {
        const database = client.db(MONGO_DATABASE)
        return await database
            .collection<T>(`${collection}${suffix}`)
            .aggregate<T>([{ $sample: { size } }])
            .toArray()
    })
}

/**
 * Counts documents in a MongoDB collection.
 *
 * @template T - The type of the documents.
 * @param {string} collection - The name of the collection.
 * @param {Filter<T>} doc - The filter to apply to the query.
 * @returns {Promise<number>} The found documents or an empty array if none found.
 * @deprecated use collection
 */
const count = async <T extends Document>(
    collection: string,
    doc: Filter<T>,
): Promise<number> =>
    await client.then(async (client) => {
        const database = client.db(MONGO_DATABASE)
        return database
            .collection<T>(`${collection}${suffix}`)
            .countDocuments(doc)
    })

/**
 * Inserts a single document into a MongoDB collection.
 *
 * @template T - The type of the document.
 * @param {string} collection - The name of the collection.
 * @param {OptionalUnlessRequiredId<T>} doc - The document to insert.
 * @returns {Promise<InsertOneResult<T>>} The result of the insert operation.
 * @deprecated use collection
 */
const insertOne = async <T extends Document>(
    collection: string,
    doc: OptionalUnlessRequiredId<T>,
): Promise<InsertOneResult<T>> => {
    return await client.then(async (client) => {
        const database = client.db(MONGO_DATABASE)
        return await database
            .collection<T>(`${collection}${suffix}`)
            .insertOne(doc)
    })
}

/**
 * Inserts multiple documents into a MongoDB collection.
 *
 * @template T - The type of the document.
 * @param {string} collection - The name of the collection.
 * @param {OptionalUnlessRequiredId<T>[]} doc - The documents to insert.
 * @returns {Promise<InsertManyResult<T>>} The result of the insert operation.
 * @deprecated use collection
 */
const insertMany = async <T extends Document>(
    collection: string,
    doc: OptionalUnlessRequiredId<T>[],
): Promise<InsertManyResult<T>> => {
    return await client.then(async (client) => {
        const database = client.db(MONGO_DATABASE)
        return await database
            .collection<T>(`${collection}${suffix}`)
            .insertMany(doc)
    })
}

/**
 * Delete multiple documents into a MongoDB collection.
 *
 * @template T - The type of the document.
 * @param {string} collection - The name of the collection.
 * @param {Filter<T>} doc - The documents to delete.
 * @returns {Promise<DeleteResult>} The result of the delete operation.
 * @deprecated use collection
 */
const deleteOne = async <T extends Document>(
    collection: string,
    doc: Filter<T>,
): Promise<DeleteResult> => {
    return await client.then(async (client) => {
        const database = client.db(MONGO_DATABASE)
        return await database
            .collection<T>(`${collection}${suffix}`)
            .deleteOne(doc)
    })
}

/**
 * Delete multiple documents into a MongoDB collection.
 *
 * @template T - The type of the document.
 * @param {string} collection - The name of the collection.
 * @param {Filter<T>} doc - The documents to delete.
 * @returns {Promise<DeleteResult>} The result of the delete operation.
 * @deprecated use collection
 */
const deleteMany = async <T extends Document>(
    collection: string,
    doc: Filter<T>,
): Promise<DeleteResult> => {
    return await client.then(async (client) => {
        const database = client.db(MONGO_DATABASE)
        return await database
            .collection<T>(`${collection}${suffix}`)
            .deleteMany(doc)
    })
}

/**
 * Replace a single document
 *
 * @template T - The type of the document.
 * @param {string} collection - The name of the collection.
 * @param {Filter<T>} filter - Target.
 * @param {OptionalUnlessRequiredId<T>} filter - The documents to replace.
 * @returns {Promise<Document | UpdateResult<T> | InsertOneResult<T>>}
 * @deprecated use collection
 */
const updateOne = async <T extends Document>(
    collection: string,
    filter: Filter<T>,
    doc: UpdateFilter<T>,
): Promise<Document | UpdateResult<T> | InsertOneResult<T>> =>
    await client.then(async (client) => {
        const database = client.db(MONGO_DATABASE)
        return await database
            .collection<T>(`${collection}${suffix}`)
            .updateOne(filter, doc)
    })

/**
 * @deprecated use one in mongo
 */
const insertOrReplace = async <T extends Document>(
    collection: string,
    filter: Filter<T>,
    update: OptionalUnlessRequiredId<T>,
): Promise<Document | UpdateResult<T>> =>
    await client.then(async (client) => {
        const database = client.db(MONGO_DATABASE)
        return await findOne(collection, filter)
            .then(async () => {
                return await database
                    .collection<T>(`${collection}${suffix}`)
                    .replaceOne(filter, update)
            })
            .catch(async () => await insertOne(collection, update))
    })

/**
 * @deprecated use one in mongo
 */
export type Migration = {
    [version: string]: (client: MongoClient) => Promise<void>
}

/**
 * Migrate the index of the database.
 *
 * @param {string} current
 * @param {string} target
 * @param {Migration} migration
 * @deprecated use one in mongo
 * @example
 * await migrate('0.0.2', async (client) => { ... })
 */
const migrate = async (
    current: string,
    target: string,
    migration: Migration,
) => {
    // Filter versions that are greater than the current version and less than or equal to the new version
    const versions = Object.keys(migration)
        .filter(
            (v) =>
                compareVersions(current, v) === -1 &&
                compareVersions(target, v) >= 0,
        )
        .sort(compareVersions)

    Logger.server(
        `MongoDB migration: ${current} => ${target}, ${JSON.stringify(
            versions,
        )}`,
    )
    for (const version of versions) {
        await client.then(async (client) => {
            await migration[version](client)
        })
    }

    return versions
}

/**
 * @deprecated use one in mongo
 */
const actions = {
    findOne,
    findMany,
    insertOne,
    insertMany,
    deleteOne,
    deleteMany,
    updateOne,
    insertOrReplace,
    count,
    random,
    migrate,
}

export default actions
