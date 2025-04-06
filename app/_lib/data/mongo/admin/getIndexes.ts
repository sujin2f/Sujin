import { MONGO_DATABASE } from '@common/constants/helper'
import client from '@common/data/mongo/mongo-client'
import type { Document, IndexDescriptionCompact } from 'mongodb'

const getIndexes = async (...collections: string[]) => {
    const indexes: Record<string, IndexDescriptionCompact> = {}
    await client.then(async (client) => {
        const database = client.db(MONGO_DATABASE)
        for (const collection of collections) {
            const index = await database
                .collection(collection)
                .indexInformation()
                .catch((e) => console.log(collection, e))

            if (index) {
                indexes[collection] = index
            }
        }
    })
    return indexes
}

export default getIndexes

export const getSchema = async (...collections: string[]) => {
    const schema: Record<string, Document> = {}
    await client.then(async (client) => {
        const database = client.db(MONGO_DATABASE)
        for (const collection of collections) {
            const info = await database
                .collection(collection)
                .options()
                .then((schema) => {
                    const { validator } = schema
                    if (validator) {
                        return validator.$jsonSchema
                    }
                    return {}
                })
                .catch((e) => console.log(collection, e))

            if (info) {
                schema[collection] = info
            }
        }
    })
    return schema
}
