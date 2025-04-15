/* Models */
import { getDatabase } from '@common/data/mongo/mongo'
import { CollectionsClient } from '@app/admin/collections/CollectionsClient'

export async function Collections() {
    const collections = await getDatabase().then(async (database) => {
        return await database.collections().then((collections) =>
            collections.map((collection) => ({
                name: collection.collectionName,
                key: collection.namespace,
            })),
        )
    })

    const drop = async (collection: string) => {
        'use server'
        await getDatabase().then(async (database) => {
            await database.dropCollection(collection)
        })
    }

    return <CollectionsClient collections={collections} drop={drop} />
}
