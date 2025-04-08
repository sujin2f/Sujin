import { MONGO_DATABASE } from '@common/constants/helper'
import client from '@common/data/mongo/mongo-client'
import type { Document, IndexDescriptionCompact } from 'mongodb'
import Mongo from '@common/data/mongo/mongo'
import { COLLECTION, T_Option } from '@app/_lib/types'
import { isAdmin } from '@app/_lib/utils-server'
import { ERROR_MESSAGE, ServerError } from '@app/_lib/constants-error'

export const getIndexes = async (...collections: string[]) => {
    if (!(await isAdmin()))
        throw new ServerError(
            ERROR_MESSAGE.GENERAL.UNAUTHORIZED,
            'getIndexes()',
        )
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
    if (!(await isAdmin()))
        throw new ServerError(ERROR_MESSAGE.GENERAL.UNAUTHORIZED, 'getSchema()')
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
export const getSystemOption = async (key: string): Promise<string> => {
    if (!(await isAdmin()))
        throw new ServerError(
            ERROR_MESSAGE.GENERAL.UNAUTHORIZED,
            'getSystemOption()',
        )
    return await Mongo.findOne<T_Option>(COLLECTION.OPTIONS, { key })
        .catch(() => ({ value: '' }))
        .then((result) => result.value)
}

/**
 * Set site-wide system options.
 *
 * @param {string} key - The key of the option.
 * @param {string} value - The value of the option.
 */
export const setSystemOption = async (key: string, value: string) => {
    if (!(await isAdmin()))
        throw new ServerError(
            ERROR_MESSAGE.GENERAL.UNAUTHORIZED,
            'setSystemOption()',
        )
    return await Mongo.insertOrReplace<T_Option>(
        COLLECTION.OPTIONS,
        { key },
        { key, value },
    )
}
