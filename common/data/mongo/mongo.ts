import type {
    MongoClient,
    Filter,
    OptionalUnlessRequiredId,
    InferIdType,
    Document,
    InsertOneOptions,
    FindOptions,
} from 'mongodb'
import { MONGO_DATABASE } from '../../constants/helper'
import { compareVersions } from '../../utils/system'
import Logger from '../../model/Logger'
import getClient from './connection'
import { DatabaseError } from '@common/model/Error'

export const closeConnection = async () => {
    const client = await getClient()
    await client.close()
}

export const getDatabase = async () => {
    const client = await getClient()
    return client.db(MONGO_DATABASE)
}

export const getCollection = async <T extends Document>(collection: string) => {
    const database = await getDatabase()
    return database.collection<T>(collection)
}

export type T_Migration = {
    [version: string]: (client: MongoClient) => Promise<void>
}

/**
 * Migrate the index of the database.
 *
 * @param {string} current
 * @param {string} target
 * @param {T_Migration} migration
 * @example
 * await migrate('0.0.2', async (client) => { ... })
 */
export const migrate = async (
    current: string,
    target: string,
    migration: T_Migration,
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
    const client = await getClient()
    for (const version of versions) {
        await migration[version](client)
    }

    return versions
}

export const findOne = async <T extends Document>(
    collectionName: string,
    doc: Filter<T>,
    options?: Omit<FindOptions, 'timeoutMode'>,
) => {
    const collection = await getCollection<T>(collectionName)
    return await collection.findOne(doc, options).then((result) => {
        if (!result) {
            throw new DatabaseError(
                'Mongo findOne does not have any result.',
                collectionName,
                doc,
            )
        }
        return result
    })
}

export const insertOne = async <T extends Document>(
    collectionName: string,
    doc: OptionalUnlessRequiredId<T>,
    options?: InsertOneOptions,
) => {
    const collection = await getCollection<T>(collectionName)
    return await collection.insertOne(doc, options)
}

export const findWithCount = async <T extends Document>(
    collectionName: string,
    filter: Filter<T>,
) => {
    const collection = await getCollection<T>(collectionName)
    const find = collection.find(filter)
    const count = await collection.countDocuments(filter)

    return { find, count }
}

export const insertOrReplace = async <T extends Document>(
    collectionName: string,
    filter: Filter<T>,
    update: OptionalUnlessRequiredId<T>,
): Promise<InferIdType<T>> => {
    const collection = await getCollection<T>(collectionName)
    return await collection.findOne(filter).then(async (doc) => {
        if (doc) {
            await collection.replaceOne(filter, update)
            return doc._id
        }
        const result = await collection.insertOne(update)
        return result.insertedId
    })
}
