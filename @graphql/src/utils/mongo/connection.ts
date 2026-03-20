import mongoose from 'mongoose'
import { EnvironmentError } from '@common/model/Error'
/* Models */
import { Logger } from '@common/model/Logger'

/**
 * Ensure required MongoDB environment variables are present.
 *
 * The module logs and throws an `EnvironmentError` at import time if
 * any of the required variables are missing. This makes failures explicit
 * early during application startup.
 */
if (!process.env.MONGO) {
    Logger.error('⛈️ Invalid/Missing environment variable: "MONGO"')
    throw new EnvironmentError('Invalid/Missing environment variable: "MONGO"')
}

if (!process.env.MONGO_USER) {
    Logger.error('⛈️ Invalid/Missing environment variable: "MONGO_USER"')
    throw new EnvironmentError('Invalid/Missing environment variable: "MONGO_USER"')
}

if (!process.env.MONGO_PASSWORD) {
    Logger.error('⛈️ Invalid/Missing environment variable: "MONGO_PASSWORD"')
    throw new EnvironmentError('Invalid/Missing environment variable: "MONGO_PASSWORD"')
}

if (!process.env.MONGO_DATABASE) {
    Logger.error('⛈️ Invalid/Missing environment variable: "MONGO_DATABASE"')
    throw new EnvironmentError('Invalid/Missing environment variable: "MONGO_DATABASE"')
}

/**
 * Connect to MongoDB using mongoose.
 *
 * Builds the connection string from environment variables and attempts to
 * connect. On success the function logs an informational message; on
 * failure it logs an error and throws an `EnvironmentError`.
 *
 * @throws {EnvironmentError} When the connection attempt fails.
 */
export const connectToDatabase = async (): Promise<void> => {
    const connection = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO}/${process.env.MONGO_DATABASE}?authSource=${process.env.MONGO_DATABASE}`
    try {
        await mongoose.connect(connection)
        Logger.info(`🚀 Successfully connected to MongoDB`)
    } catch {
        Logger.error(`⛈️ Filed to connect MongoDB server: ${connection}`)
        throw new EnvironmentError('Filed to connect MongoDB')
    }
}
