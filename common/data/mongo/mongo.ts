import {
    InsertManyResult,
    type Document,
    type Filter,
    type InsertOneResult,
    type OptionalUnlessRequiredId,
    type WithId,
} from 'mongodb'
import MongoClient from './mongo-client'

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
    const client = MongoClient
    let result: WithId<T> | null
    try {
        const database = client.db('sujin')
        result = await database.collection<T>(collection).findOne(doc)
    } catch (e: unknown) {
        throw e
    }

    if (!result) {
        throw Error(
            `Mongo findOne failed to fetch database collection ${collection} with a document ${JSON.stringify(
                doc,
            )}`,
        )
    }

    return result
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
): Promise<WithId<T>[]> => {
    const client = MongoClient
    try {
        const database = client.db('sujin')
        return await database.collection<T>(collection).find(doc).toArray()
    } catch (e: unknown) {
        throw e
    }
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
    const client = MongoClient
    try {
        const database = client.db('sujin')
        return await database.collection<T>(collection).insertOne(doc)
    } catch (e: unknown) {
        throw e
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
): Promise<InsertManyResult<T>> => {
    const client = MongoClient
    try {
        const database = client.db('sujin')
        return await database.collection<T>(collection).insertMany(doc)
    } catch (e: unknown) {
        throw e
    }
}

const deleteMany = async <T extends Document>(
    collection: string,
    doc: Filter<T>,
) => {
    const client = MongoClient
    try {
        const database = client.db('sujin')
        return await database.collection<T>(collection).deleteMany(doc)
    } catch (e: unknown) {
        throw e
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
