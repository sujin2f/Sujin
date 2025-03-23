import { InsertManyResult } from 'mongodb'
import type {
    Sort,
    Document,
    Filter,
    InsertOneResult,
    OptionalUnlessRequiredId,
    WithId,
    IndexSpecification,
    CreateIndexesOptions,
    DropIndexesOptions,
    IndexDirection,
} from 'mongodb'
import client from './mongo-client'
import { compareVersions } from '../../utils/system'
import type { MongoOptionCollection } from '../../types'

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
        const database = client.db(process.env.MONGO_DATABASE)
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

/**
 * Finds multiple documents in a MongoDB collection.
 *
 * @template T - The type of the documents.
 * @param {string} collection - The name of the collection.
 * @param {Filter<T>} doc - The filter to apply to the query.
 * @param {boolean} quiet - If log error message.
 * @returns {Promise<(WithId<T> | T)[]>} The found documents or an empty array if none found.
 * @throws {Error} If the documents are not found.
 */
const findMany = async <T extends Document>(
    collection: string,
    doc: Filter<T>,
    options?: {
        sort?: Sort
        limit?: number
    },
): Promise<WithId<T>[]> => {
    return await client.then(async (client) => {
        const database = client.db(process.env.MONGO_DATABASE)
        let find = database.collection<T>(collection).find(doc)
        if (options && options.sort) {
            find = find.sort(options.sort)
        }
        if (options && options.limit) {
            find = find.limit(options.limit)
        }
        return await find.toArray()
    })
}

/**
 * Inserts a single document into a MongoDB collection.
 *
 * @template T - The type of the document.
 * @param {string} collection - The name of the collection.
 * @param {OptionalUnlessRequiredId<T>} doc - The document to insert.
 * @returns {Promise<InsertOneResult<T>>} The result of the insert operation.
 * @throws {Error} If the insert operation fails.
 */
const insertOne = async <T extends Document>(
    collection: string,
    doc: OptionalUnlessRequiredId<T>,
): Promise<InsertOneResult<T>> => {
    return await client.then(async (client) => {
        const database = client.db(process.env.MONGO_DATABASE)
        return await database.collection<T>(collection).insertOne(doc)
    })
}

/**
 * Inserts multiple documents into a MongoDB collection.
 *
 * @template T - The type of the document.
 * @param {string} collection - The name of the collection.
 * @param {OptionalUnlessRequiredId<T>[]} doc - The documents to insert.
 * @param {boolean} quiet - If log error message.
 * @returns {Promise<InsertManyResult<T>>} The result of the insert operation.
 * @throws {Error} If the insert operation fails.
 */
const insertMany = async <T extends Document>(
    collection: string,
    doc: OptionalUnlessRequiredId<T>[],
): Promise<InsertManyResult<T>> => {
    return await client.then(async (client) => {
        const database = client.db(process.env.MONGO_DATABASE)
        return await database.collection<T>(collection).insertMany(doc)
    })
}

const deleteMany = async <T extends Document>(
    collection: string,
    doc: Filter<T>,
) => {
    return await client.then(async (client) => {
        const database = client.db(process.env.MONGO_DATABASE)
        return await database.collection<T>(collection).deleteMany(doc)
    })
}

const replaceOne = async <T extends Document>(
    collection: string,
    filter: Filter<T>,
    doc: OptionalUnlessRequiredId<T>,
) => {
    return await client.then(async (client) => {
        const database = client.db(process.env.MONGO_DATABASE)
        return await database.collection<T>(collection).replaceOne(filter, doc)
    })
}

const getSystemOption = async (key: string): Promise<string> =>
    await findOne<MongoOptionCollection>('options', { key }).then(
        (result) => result.value,
    )

const setSystemOption = async (key: string, value: string) =>
    await findOne<MongoOptionCollection>('options', { key })
        .then(async () => {
            await replaceOne('options', { key }, { key, value })
        })
        .catch(async () => {
            await insertOne('options', { key, value })
        })

const actions = {
    findOne,
    findMany,
    insertOne,
    insertMany,
    deleteMany,
    replaceOne,
    getSystemOption,
    setSystemOption,
}

export default actions

type IndexInfo = {
    [collection: string]: {
        drop?: (
            | [
                  {
                      [key: string]: IndexDirection
                  },
                  DropIndexesOptions,
              ]
            | [
                  {
                      [key: string]: IndexDirection
                  },
              ]
        )[]
        create?: (
            | [IndexSpecification, CreateIndexesOptions]
            | [IndexSpecification]
        )[]
    }
}

const updateIndex = async (indexInfo: IndexInfo) => {
    await client.then(async (client) => {
        const database = client.db(process.env.MONGO_DATABASE)

        for (const [collection, info] of Object.entries(indexInfo)) {
            if (info.drop) {
                const index = await (
                    await database.collection(collection).indexes()
                ).reduce(
                    (acc, block) => ({
                        ...acc,
                        [JSON.stringify(block.key)]: (block.name ||
                            '') as string,
                    }),
                    {} as Record<string, string>,
                )

                for (const [indexOption, dropOptions] of info.drop) {
                    const name = index[JSON.stringify(indexOption)]
                    if (name) {
                        await database
                            .collection(collection)
                            .dropIndex(name, dropOptions)
                    }
                }
            }

            if (info.create) {
                for (const [indexSpec, options] of info.create) {
                    await database
                        .collection(collection)
                        .createIndex(indexSpec, options)
                }
            }
        }
    })
}

/**
 * @example
 * await migrateIndex('0.0.2', {
        '0.0.2': {
            test: {
                drop: [[{ id: 1 }]],
            },
        },
        '0.0.1': {
            test: {
                create: [[{ id: 1 }]],
            },
        },
    })
 */
export type MigrateIndex = {
    [version: string]: IndexInfo
}
export const migrateIndex = async (
    targetVersion: string,
    indexInfo: MigrateIndex,
) => {
    const option = await getSystemOption('version').catch(() => '0.0.0')
    // Filter versions that are greater than the current version and less than or equal to the new version
    const versions = Object.keys(indexInfo)
        .filter(
            (v) =>
                compareVersions(option, v) === -1 &&
                compareVersions(targetVersion, v) >= 0,
        )
        .sort(compareVersions)

    for (const version of versions) {
        await updateIndex(indexInfo[version])
    }

    await setSystemOption('version', targetVersion)
}
