import type { Collection } from 'mongodb'
import { getDatabase } from '../data/mongo/mongo'

export const clearMongo = async (...args: string[]) => {
    const db = await getDatabase()
    const collections: Collection[] = []

    if (collections.length === 0) {
        collections.push(...(await db.collections()))
    } else {
        for (const arg in args) {
            collections.push(db.collection(arg))
        }
    }

    for (const collection in collections) {
        await collections[collection].drop()
    }
}
