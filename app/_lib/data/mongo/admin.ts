import { MONGO_DATABASE } from '@common/constants/helper'
import client from '@common/data/mongo/mongo-client'
import type { Document, IndexDescriptionCompact } from 'mongodb'
import Mongo from '@common/data/mongo/mongo'
import type { OptionType } from '@app/_lib/data/mongo/types'
import { COLLECTION } from '@app/_lib/data/types'

export const getIndexes = async (...collections: string[]) => {
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

/**
 * Get site-wide system options.
 *
 * @param {string} key - The key of the option.
 * @returns {Promise<string>} Value
 */
export const getSystemOption = async (key: string): Promise<string> =>
    await Mongo.findOne<OptionType>(COLLECTION.OPTIONS, { key })
        .catch(() => ({ value: '' }))
        .then((result) => result.value)

/**
 * Set site-wide system options.
 *
 * @param {string} key - The key of the option.
 * @param {string} value - The value of the option.
 */
export const setSystemOption = async (key: string, value: string) =>
    await Mongo.findOne<OptionType>(COLLECTION.OPTIONS, { key })
        .then(async () => {
            await Mongo.replaceOne(COLLECTION.OPTIONS, { key }, { key, value })
        })
        .catch(async () => {
            await Mongo.insertOne(COLLECTION.OPTIONS, { key, value })
        })
