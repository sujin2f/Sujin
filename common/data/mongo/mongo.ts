import {
    InsertManyResult,
    type Document,
    type Filter,
    type InsertOneResult,
    type OptionalUnlessRequiredId,
    type WithId,
} from 'mongodb'
import MongoClient from './mongo-client'
import { Error as CustomError, isCustomError } from '../../model/Error'

const handleCustomError = (e: unknown, quiet: boolean) => {
    if (isCustomError(e)) {
        if (!quiet) {
            e.echo('log')
            return e
        }
    }
    if (e instanceof Error) {
        const error = new CustomError(e.message)
        if (!quiet) {
            error.echo('log')
            return error
        }
    }
    return e
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
    const client = MongoClient
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
        throw handleCustomError(e, quiet)
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
    const client = MongoClient
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
        throw handleCustomError(e, quiet)
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
    const client = MongoClient
    try {
        const database = client.db('sujin')
        return await database.collection<T>(collection).insertOne(doc)
    } catch (e: unknown) {
        throw handleCustomError(e, quiet)
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
    const client = MongoClient
    try {
        const database = client.db('sujin')
        return await database.collection<T>(collection).insertMany(doc)
    } catch (e: unknown) {
        throw handleCustomError(e, quiet)
    }
}

const deleteMany = async <T extends Document>(
    collection: string,
    doc: Filter<T>,
    quiet: boolean = false,
) => {
    const client = MongoClient
    try {
        const database = client.db('sujin')
        return await database.collection<T>(collection).deleteMany(doc)
    } catch (e: unknown) {
        throw handleCustomError(e, quiet)
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
