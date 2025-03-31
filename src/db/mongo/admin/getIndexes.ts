import client from '@common/data/mongo/mongo-client'
import type { IndexDescriptionCompact } from 'mongodb'

const getIndexes = async (...collections: string[]) => {
    const indexes: Record<string, IndexDescriptionCompact> = {}
    await client.then(async (client) => {
        const database = client.db(process.env.MONGO_DATABASE)
        for (const collection of collections) {
            const index = await database
                .collection(collection)
                .indexInformation()
            indexes[collection] = index
        }
    })
    return indexes
}

export default getIndexes
