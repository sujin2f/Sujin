/* Components */
import Collections from '@app/admin/collections/Collections'
/* Constants */
import { MONGO_DATABASE } from '@common/constants/helper'
/* Models */
import client from '@common/data/mongo/mongo-client'

export default async function Page() {
    const collections = await client.then(async (client) => {
        const database = client.db(MONGO_DATABASE)
        // Drop all collections
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

    return <Collections collections={collections} drop={drop} />
}
