import mongoose from 'mongoose'
import { EnvironmentError } from '@sujin/common/model/Error'
import dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') })

if (!process.env.MONGO) {
    throw new EnvironmentError('Invalid/Missing environment variable: "MONGO"')
}

export const connectToDatabase = async () => {
    try {
        const port = process.env.MONGO_PORT || '27018'
        const connection = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO}:${port}/${process.env.MONGO_DATABASE}?authSource=${process.env.MONGO_DATABASE}`
        await mongoose.connect(connection)
        console.log('🚀 Successfully connected to MongoDB')
    } catch (error) {
        console.error(error)
    }
}
