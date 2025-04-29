/* Models */
import { getDatabase } from '@common/data/mongo/mongo'
import { CollectionsClient } from '@app/admin/_components/Collections.client'

export async function CollectionsServer() {
    let totalSize = 0
    const collections = await getDatabase()
        .then(async (database) => {
            const stats = await database.stats({
                collation: { locale: 'en_US' },
            })
            totalSize = stats.totalSize
            return await database.collections().then((collections) =>
                collections.map((collection) => ({
                    name: collection.collectionName,
                    key: collection.namespace,
                })),
            )
        })
        .catch(() => [])

    const drop = async (collection: string) => {
        'use server'
        await getDatabase().then(async (database) => {
            await database.dropCollection(collection)
        })
    }

    return (
        <CollectionsClient
            collections={collections}
            drop={drop}
            totalSize={totalSize}
        />
    )
}
