// see https://github.com/vercel/next.js/tree/canary/examples/with-mongodb

import { MongoClient } from 'mongodb'
import { IS_DEV } from '@src/constants/system'

if (!process.env.MONGO) {
    throw new Error('Invalid/Missing environment variable: "MONGO"')
}

const uri = process.env.MONGO
const options = { appName: 'devrel.template.nextjs' }

let client: MongoClient

if (IS_DEV) {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    const globalWithMongo = global as typeof globalThis & {
        _mongoClient?: MongoClient
    }

    if (!globalWithMongo._mongoClient) {
        globalWithMongo._mongoClient = new MongoClient(
            `mongodb://${uri}:27017`,
            options,
        )
    }
    client = globalWithMongo._mongoClient
} else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(`mongodb://${uri}:27017`, options)
}

// Export a module-scoped MongoClient. By doing this in a
// separate module, the client can be shared across functions.

export default client
