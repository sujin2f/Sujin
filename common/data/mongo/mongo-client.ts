import { MongoClient } from 'mongodb'

if (!process.env.MONGO) {
    throw new Error('Invalid/Missing environment variable: "MONGO"')
}

const uri = process.env.MONGO
const options = { appName: 'devrel.template.nextjs' }

/**
 * @description Create a new MongoClient Promise instance
 * @see https://mongodb.github.io/node-mongodb-native/4.0/classes/mongoclient.html
 */
const client = MongoClient.connect(`mongodb://${uri}:27017`, options)
export default client
