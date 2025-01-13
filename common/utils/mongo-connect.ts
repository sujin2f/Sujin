import mongoose from 'mongoose'
import { Error } from '../model/Error'

const host = process.env.MONGO || 'localhost:27017'
const user = process.env.MONGO_USER
const pass = process.env.MONGO_PASS
const uri = `mongodb://${user}:${pass}@${host}`
const dbName = process.env.MONGO_DATABASE

export const mongoStrings = {
    uri,
    dbName,
}

export const mongoConnect = async (): Promise<typeof mongoose> => {
    if (!user || !pass || !dbName) {
        throw new Error('Mongo DB connection.')
    }

    return mongoose
        .set('strictQuery', true)
        .connect(uri, {
            dbName,
        })
        .then((db) => {
            return db
        })
        .catch((e) => {
            throw new Error(e)
        })
}
