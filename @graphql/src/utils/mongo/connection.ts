import mongoose from 'mongoose'
import { EnvironmentError } from '@sujin/share/model/Error'
/* Models */
import Logger from '@src/utils/logger'

if (!process.env.MONGO) {
    Logger.error('⛈️ Invalid/Missing environment variable: "MONGO"')
    throw new EnvironmentError('Invalid/Missing environment variable: "MONGO"')
}

if (!process.env.MONGO_PORT) {
    Logger.error('⛈️ Invalid/Missing environment variable: "MONGO_PORT"')
    throw new EnvironmentError(
        'Invalid/Missing environment variable: "MONGO_PORT"',
    )
}

if (!process.env.MONGO_USER) {
    Logger.error('⛈️ Invalid/Missing environment variable: "MONGO_USER"')
    throw new EnvironmentError(
        'Invalid/Missing environment variable: "MONGO_USER"',
    )
}

if (!process.env.MONGO_PASSWORD) {
    Logger.error('⛈️ Invalid/Missing environment variable: "MONGO_PASSWORD"')
    throw new EnvironmentError(
        'Invalid/Missing environment variable: "MONGO_PASSWORD"',
    )
}

if (!process.env.MONGO_DATABASE) {
    Logger.error('⛈️ Invalid/Missing environment variable: "MONGO_DATABASE"')
    throw new EnvironmentError(
        'Invalid/Missing environment variable: "MONGO_DATABASE"',
    )
}

export const connectToDatabase = async () => {
    const port = process.env.MONGO_PORT || '27018'
    const connection = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO}:${port}/${process.env.MONGO_DATABASE}?authSource=${process.env.MONGO_DATABASE}`
    try {
        await mongoose.connect(connection)
        Logger.info(`🚀 Successfully connected to MongoDB: ${connection}`)
    } catch {
        Logger.error(`⛈️ Filed to connect MongoDB server: ${connection}`)
        throw new EnvironmentError('Filed to connect MongoDB')
    }
}
