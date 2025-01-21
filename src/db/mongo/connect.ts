// see https://github.com/vercel/next.js/tree/canary/examples/with-mongodb

import {
    Document,
    Filter,
    MongoClient,
    OptionalUnlessRequiredId,
} from 'mongodb'

const getClient = () => {
    if (!process.env.MONGO) {
        throw new Error('Invalid/Missing environment variable: "MONGO"')
    }

    const uri = process.env.MONGO
    const options = { appName: 'devrel.template.nextjs' }

    return new MongoClient(`mongodb://${uri}`, options)
}

const findOne = async <T extends Document>(
    collection: string,
    doc: Filter<T>,
) => {
    const client = getClient()
    try {
        const database = client.db('ether')
        const result = await database.collection<T>(collection).findOne(doc)
        return result || undefined
    } catch (e: unknown) {
        console.error(e)
        return undefined
    } finally {
        // Close the MongoDB client connection
        await client.close()
    }
}

const findMany = async <T extends Document>(
    collection: string,
    doc: Filter<T>,
) => {
    const client = getClient()
    try {
        const database = client.db('ether')
        const result = await database
            .collection<T>(collection)
            .find(doc)
            .toArray()
        return result || []
    } catch (e: unknown) {
        console.error(e)
        return []
    } finally {
        // Close the MongoDB client connection
        await client.close()
    }
}

const insertOne = async <T extends Document>(
    collection: string,
    doc: OptionalUnlessRequiredId<T>,
) => {
    const client = getClient()
    try {
        const database = client.db('ether')
        const result = await database.collection<T>(collection).insertOne(doc)
        return result
    } catch (e: unknown) {
        console.error(e)
        return false
    } finally {
        // Close the MongoDB client connection
        await client.close()
    }
}

const actions = {
    findOne,
    findMany,
    insertOne,
}

export default actions
