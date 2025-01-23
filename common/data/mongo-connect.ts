// see https://github.com/vercel/next.js/tree/canary/examples/with-mongodb

import {
    InsertManyResult,
    MongoClient,
    type Document,
    type Filter,
    type InsertOneResult,
    type OptionalUnlessRequiredId,
    type WithId,
} from 'mongodb'
import { Error as CustomError, isCustomError } from '@common/model/Error'

const handleCustomError = (e: unknown, quiet: boolean) => {
    if (isCustomError(e)) {
        if (!quiet) {
            e.echo('log')
        }
        throw e
    }
}

const handleJSError = (e: unknown, quiet: boolean) => {
    if (e instanceof Error) {
        const error = new CustomError(e.message)
        if (!quiet) {
            error.echo('log')
        }
        throw error
    }
}

/**
 * Creates and returns a MongoDB client.
 *
 * @returns {MongoClient} The MongoDB client.
 * @throws {Error} If the MONGO environment variable is missing or invalid.
 */
const getClient = () => {
    if (!process.env.MONGO) {
        throw new CustomError('Invalid/Missing environment variable: "MONGO"', {
            level: 'log',
        })
    }

    const uri = process.env.MONGO
    const options = { appName: 'devrel.template.nextjs' }

    return new MongoClient(`mongodb://${uri}`, options)
}

/**
 * Finds a single document in a MongoDB collection.
 *
 * @template T - The type of the document.
 * @param {string} collection - The name of the collection.
 * @param {Filter<T>} doc - The filter to apply to the query.
 * @param {boolean} quiet - If log error message.
 * @returns {Promise<WithId<T>>} The found document or undefined if not found.
 * @throws {Error} If the document is not found.
 */
const findOne = async <T extends Document>(
    collection: string,
    doc: Filter<T>,
    quiet: boolean = false,
): Promise<WithId<T>> => {
    const client = getClient()
    try {
        const database = client.db('sujin')
        const result = await database.collection<T>(collection).findOne(doc)
        if (!result) {
            throw new CustomError(
                `Mongo findOne failed to fetch database collection ${collection} with a document ${JSON.stringify(
                    doc,
                )}`,
            )
        }
        return result
    } catch (e: unknown) {
        handleCustomError(e, quiet)
        handleJSError(e, quiet)
        throw e
    } finally {
        // Close the MongoDB client connection
        await client.close()
    }
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
    quiet: boolean = false,
): Promise<WithId<T>[]> => {
    const client = getClient()
    try {
        const database = client.db('sujin')
        const result = await database
            .collection<T>(collection)
            .find(doc)
            .toArray()
        if (!result.length) {
            throw new CustomError(
                `Mongo findMany failed to fetch collection ${collection} with a document ${JSON.stringify(
                    doc,
                )}`,
            )
        }
        return result
    } catch (e: unknown) {
        handleCustomError(e, quiet)
        handleJSError(e, quiet)
        throw e
    } finally {
        // Close the MongoDB client connection
        await client.close()
    }
}

/**
 * Inserts a single document into a MongoDB collection.
 *
 * @template T - The type of the document.
 * @param {string} collection - The name of the collection.
 * @param {OptionalUnlessRequiredId<T>} doc - The document to insert.
 * @param {boolean} quiet - If log error message.
 * @returns {Promise<InsertOneResult<T>>} The result of the insert operation.
 * @throws {Error} If the insert operation fails.
 */
const insertOne = async <T extends Document>(
    collection: string,
    doc: OptionalUnlessRequiredId<T>,
    quiet: boolean = false,
): Promise<InsertOneResult<T>> => {
    const client = getClient()
    try {
        const database = client.db('sujin')
        return await database.collection<T>(collection).insertOne(doc)
    } catch (e: unknown) {
        handleJSError(e, quiet)
        throw e
    } finally {
        // Close the MongoDB client connection
        await client.close()
    }
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
    quiet: boolean = false,
): Promise<InsertManyResult<T>> => {
    const client = getClient()
    try {
        const database = client.db('sujin')
        return await database.collection<T>(collection).insertMany(doc)
    } catch (e: unknown) {
        handleJSError(e, quiet)
        throw e
    } finally {
        // Close the MongoDB client connection
        await client.close()
    }
}

const deleteMany = async <T extends Document>(
    collection: string,
    doc: Filter<T>,
    quiet: boolean = false,
) => {
    const client = getClient()
    try {
        const database = client.db('sujin')
        return await database.collection<T>(collection).deleteMany(doc)
    } catch (e: unknown) {
        handleJSError(e, quiet)
        throw e
    } finally {
        // Close the MongoDB client connection
        await client.close()
    }
}

const actions = {
    findOne,
    findMany,
    insertOne,
    insertMany,
    deleteMany,
}

export default actions
