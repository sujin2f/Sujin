/* Constants */
import { MONGO_DATABASE } from '@common/constants/helper'
/* Models */
import client from '@common/data/mongo/mongo-client'
import { CollectionsClient } from './CollectionsClient'

export async function Collections() {
    const collections = await client.then(async (client) => {
        const database = client.db(MONGO_DATABASE)
        return await database.collections().then((collections) =>
            collections.map((collection) => ({
                name: collection.collectionName,
                key: collection.namespace,
            })),
        )
    })

    const drop = async (collection: string) => {
        'use server'
        await client.then(async (client) => {
            const database = client.db(MONGO_DATABASE)
            await database.dropCollection(collection)
        })
    }

    return <CollectionsClient collections={collections} drop={drop} />
}
