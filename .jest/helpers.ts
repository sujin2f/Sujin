import client from '../common/data/mongo/mongo-client'
import { MONGO_DATABASE } from '../common/constants/helper'

export const clearMongo = async (...collections: string[]) =>
    await client.then(async (client) => {
        const database = client.db(MONGO_DATABASE)
        try {
            for (const collection of collections) {
                await database.collection(collection).drop()
            }
        } catch {}

        return client
    })
