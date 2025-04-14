import type { Document, IndexDescriptionCompact } from 'mongodb'
/* Models */
import Mongo from '@common/data/mongo/mongo'
import client from '@common/data/mongo/mongo-client'
import Cached from '@common/model/Cached'
import { ERROR_MESSAGE, ServerError } from '@app/_lib/constants-error'
/* CONSTANTS */
import { IS_DEV, MONGO_DATABASE } from '@common/constants/helper'
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
/* Utils */
import { isAdmin } from '@app/_lib/utils-server'
import { getCacheKey } from '@app/_lib/utils'
/* T_Types */
import { CACHE_KEY, COLLECTION, type T_Option } from '@app/_lib/types'

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
export const getCachedOption = async (key: string): Promise<string> => {
    return await Cached.getInstance().getOrExecute(
        getCacheKey(CACHE_KEY.OPTIONS, key),
        async () =>
            await Mongo.findOne<T_Option>(COLLECTION.OPTIONS, { key })
                .catch(() => ({ value: '' }))
                .then((result) => result.value),
        WEEK_IN_SECONDS,
        IS_DEV,
    )
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
