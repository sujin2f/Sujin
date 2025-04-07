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
import client from './mongo-client'
/* Utils */
import { compareVersions } from '../../utils/system'
/* CONSTANTS */
import { MONGO_DATABASE } from '@common/constants/helper'
import Logger from '@common/model/Logger'

/**
 * Finds a single document in a MongoDB collection.
 *
 * @template T - The type of the document.
 * @param {string} collection - The name of the collection.
 * @param {Filter<T>} doc - The filter to apply to the query.
 * @returns {Promise<WithId<T>>} The found document or undefined if not found.
 * @throws {Error} If the document is not found.
 */
const findOne = async <T extends Document>(
    collection: string,
    doc: Filter<T>,
): Promise<WithId<T>> => {
    return await client.then(async (client) => {
        const database = client.db(MONGO_DATABASE)
        const result = await database.collection<T>(collection).findOne(doc)

        if (!result) {
            throw Error(
                `Mongo findOne failed to fetch database collection ${collection} with a document ${JSON.stringify(
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
 */
const findMany = async <T extends Document>(
    collection: string,
    doc: Filter<T>,
    options?: findManyOptions,
): Promise<WithId<T>[]> => {
    return await client.then(async (client) => {
        const database = client.db(MONGO_DATABASE)
        let find = database.collection<T>(collection).find(doc)
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
            .collection<T>(collection)
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
 */
const count = async <T extends Document>(
    collection: string,
    doc: Filter<T>,
): Promise<number> =>
    await client.then(async (client) => {
        const database = client.db(MONGO_DATABASE)
        return database.collection<T>(collection).countDocuments(doc)
    })

/**
 * Inserts a single document into a MongoDB collection.
 *
 * @template T - The type of the document.
 * @param {string} collection - The name of the collection.
 * @param {OptionalUnlessRequiredId<T>} doc - The document to insert.
 * @returns {Promise<InsertOneResult<T>>} The result of the insert operation.
 */
const insertOne = async <T extends Document>(
    collection: string,
    doc: OptionalUnlessRequiredId<T>,
): Promise<InsertOneResult<T>> => {
    return await client.then(async (client) => {
        const database = client.db(MONGO_DATABASE)
        return await database.collection<T>(collection).insertOne(doc)
    })
}

/**
 * Inserts multiple documents into a MongoDB collection.
 *
 * @template T - The type of the document.
 * @param {string} collection - The name of the collection.
 * @param {OptionalUnlessRequiredId<T>[]} doc - The documents to insert.
 * @returns {Promise<InsertManyResult<T>>} The result of the insert operation.
 */
const insertMany = async <T extends Document>(
    collection: string,
    doc: OptionalUnlessRequiredId<T>[],
): Promise<InsertManyResult<T>> => {
    return await client.then(async (client) => {
        const database = client.db(MONGO_DATABASE)
        return await database.collection<T>(collection).insertMany(doc)
    })
}

/**
 * Delete multiple documents into a MongoDB collection.
 *
 * @template T - The type of the document.
 * @param {string} collection - The name of the collection.
 * @param {Filter<T>} doc - The documents to delete.
 * @returns {Promise<DeleteResult>} The result of the delete operation.
 */
const deleteOne = async <T extends Document>(
    collection: string,
    doc: Filter<T>,
): Promise<DeleteResult> => {
    return await client.then(async (client) => {
        const database = client.db(MONGO_DATABASE)
        return await database.collection<T>(collection).deleteOne(doc)
    })
}

/**
 * Delete multiple documents into a MongoDB collection.
 *
 * @template T - The type of the document.
 * @param {string} collection - The name of the collection.
 * @param {Filter<T>} doc - The documents to delete.
 * @returns {Promise<DeleteResult>} The result of the delete operation.
 */
const deleteMany = async <T extends Document>(
    collection: string,
    doc: Filter<T>,
): Promise<DeleteResult> => {
    return await client.then(async (client) => {
        const database = client.db(MONGO_DATABASE)
        return await database.collection<T>(collection).deleteMany(doc)
    })
}

/**
 * Replace a single document into a MongoDB collection.
 *
 * @template T - The type of the document.
 * @param {string} collection - The name of the collection.
 * @param {Filter<T>} filter - Target.
 * @param {OptionalUnlessRequiredId<T>} filter - The documents to replace.
 * @returns {Promise<Document | UpdateResult<T>>} The result of the replace operation.
 */
const replaceOne = async <T extends Document>(
    collection: string,
    filter: Filter<T>,
    doc: OptionalUnlessRequiredId<T>,
): Promise<Document | UpdateResult<T>> => {
    return await client.then(async (client) => {
        const database = client.db(MONGO_DATABASE)
        return await database.collection<T>(collection).replaceOne(filter, doc)
    })
}

const updateOne = async <T extends Document>(
    collection: string,
    filter: Filter<T>,
    update: UpdateFilter<T>,
): Promise<Document | UpdateResult<T>> => {
    return await client.then(async (client) => {
        const database = client.db(MONGO_DATABASE)
        return await database
            .collection<T>(collection)
            .updateOne(filter, update)
    })
}

export type Migration = {
    [version: string]: (client: MongoClient) => Promise<void>
}

/**
 * Migrate the index of the database.
 *
 * @param {string} current
 * @param {string} target
 * @param {Migration} migration
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

const actions = {
    findOne,
    findMany,
    insertOne,
    insertMany,
    deleteOne,
    deleteMany,
    replaceOne,
    updateOne,
    count,
    random,
    migrate,
}

export default actions
