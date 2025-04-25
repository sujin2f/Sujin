import { MongoClient } from 'mongodb'
import { IS_TEST } from '../../constants/helper'
import { EnvironmentError } from '../../model/Error'

if (!process.env.MONGO) {
    throw new EnvironmentError('Invalid/Missing environment variable: "MONGO"')
}

const uri = process.env.MONGO
const options = { appName: 'devrel.template.nextjs' }
const port = process.env.MONGO_PORT || '27017'
const connection = IS_TEST
    ? `mongodb://${uri}:${port}`
    : `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${uri}:${port}/${process.env.MONGO_DATABASE}?authSource=${process.env.MONGO_DATABASE}`

const getClient = async () => await MongoClient.connect(connection, options)
console.log(connection)
export default getClient
