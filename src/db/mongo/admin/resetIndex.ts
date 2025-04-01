import client from '@common/data/mongo/mongo-client'
import Mongo, { migrateIndex } from '@common/data/mongo/mongo'
import { mongoMigration } from '@src/constants/mongo-migration'
import { VERSION } from '@common/constants/helper'

const resetIndex = async (...collections: string[]) => {
    await client.then(async (client) => {
        const database = client.db(process.env.MONGO_DATABASE)
        for (const collection of collections) {
            await database.collection(collection).dropIndexes()
        }
    })

    await Mongo.setSystemOption('version', '0.0.0')

    // Migrate MongoDB indexes
    await migrateIndex(VERSION, mongoMigration)
}

export default resetIndex
