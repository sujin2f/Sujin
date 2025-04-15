import {
    type Filter,
    MongoClient,
    type OptionalUnlessRequiredId,
    type InferIdType,
    type Document,
} from 'mongodb'
import { IS_TEST, MONGO_DATABASE } from '../../constants/helper'
import { compareVersions } from '../../utils/system'
import Logger from '../../model/Logger'

if (!process.env.MONGO) {
    throw new Error('Invalid/Missing environment variable: "MONGO"')
}

const uri = process.env.MONGO
const options = { appName: 'devrel.template.nextjs' }
const connection =
    process.env.ENVIRONMENT === 'github'
        ? `mongodb://${uri}:27017/`
        : `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${uri}:27017/${process.env.MONGO_DATABASE}?authSource=${process.env.MONGO_DATABASE}`

export const suffix = IS_TEST ? `-${process.env.JEST_WORKER_ID}` : ''

export const closeConnection = async () =>
    await MongoClient.connect(connection, options).then(
        async (client) => await client.close(),
    )

export const getDatabase = async () =>
    await MongoClient.connect(connection, options).then((client) =>
        client.db(MONGO_DATABASE),
    )

export const getCollection = async <T extends Document>(collection: string) =>
    await MongoClient.connect(connection, options).then((client) => {
        const database = client.db(MONGO_DATABASE)
        return database.collection<T>(`${collection}${suffix}`)
    })

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
    for (const version of versions) {
        await MongoClient.connect(connection, options).then(async (client) => {
            await migration[version](client)
        })
    }

    return versions
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
