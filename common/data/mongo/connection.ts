import { MongoClient } from 'mongodb'
import { IS_TEST } from '../../constants/helper'
import { EnvironmentError } from '../../model/Error'

if (!process.env.MONGO) {
    throw new EnvironmentError('Invalid/Missing environment variable: "MONGO"')
}

interface MongoCache {
    connection?: MongoClient
    promise?: Promise<MongoClient>
}
declare global {
    // eslint-disable-next-line no-var
    var mongo: MongoCache
}

let cached = global.mongo
if (!cached) {
    cached = global.mongo = { connection: undefined, promise: undefined }
}

const Mongo = async (): Promise<MongoClient> => {
    if (cached.connection) {
        return cached.connection
    }

    if (!cached.promise) {
        const uri = process.env.MONGO
        const options = { appName: 'devrel.template.nextjs' }
        const port = process.env.MONGO_TEST_PORT || '27018'
        const connection = IS_TEST
            ? `mongodb://${uri}:${port}`
            : `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${uri}:27017/${process.env.MONGO_DATABASE}?authSource=${process.env.MONGO_DATABASE}`

        cached.promise = MongoClient.connect(connection, options)
    }
    cached.connection = await cached.promise
    return cached.connection
}

export default Mongo
