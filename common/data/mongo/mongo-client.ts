import { MongoClient } from 'mongodb'

if (!process.env.MONGO) {
    throw new Error('Invalid/Missing environment variable: "MONGO"')
}

const uri = process.env.MONGO
const options = { appName: 'devrel.template.nextjs' }

const client = MongoClient.connect(`mongodb://${uri}:27017`, options)
export default client
