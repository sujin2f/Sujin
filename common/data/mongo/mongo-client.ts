import { MongoClient } from 'mongodb'

if (!process.env.MONGO) {
    throw new Error('Invalid/Missing environment variable: "MONGO"')
}

const uri = process.env.MONGO
const options = { appName: 'devrel.template.nextjs' }
const connection =
    process.env.ENVIRONMENT === 'github'
        ? `mongodb://${uri}:27017/`
        : `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${uri}:27017/${process.env.MONGO_DATABASE}?authSource=${process.env.MONGO_DATABASE}`

/**
 * @description Create a new MongoClient Promise instance
 * @see https://mongodb.github.io/node-mongodb-native/4.0/classes/mongoclient.html
 */
const client = MongoClient.connect(connection, options)
export default client
