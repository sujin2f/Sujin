import { MongoClient } from 'mongodb'
import { IS_TEST } from '../../constants/helper'
import { EnvironmentError } from '../../model/Error'

if (!process.env.MONGO) {
    throw new EnvironmentError('Invalid/Missing environment variable: "MONGO"')
}

const uri = process.env.MONGO
const options = { appName: 'devrel.template.nextjs' }
const connection = IS_TEST
    ? `mongodb://${uri}:27018`
    : `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${uri}:27017/${process.env.MONGO_DATABASE}?authSource=${process.env.MONGO_DATABASE}`

const getClient = async () => await MongoClient.connect(connection, options)
export default getClient
