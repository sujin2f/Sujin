import type { Document, IndexDescriptionCompact } from 'mongodb'
/* Models */
import Cached from '@common/model/Cached'
import { PermissionError } from '@common/model/Error'
/* CONSTANTS */
import { ERROR_MESSAGE } from '@app/_lib/constants-error'
import { IS_DEV } from '@common/constants/helper'
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
/* Utils */
import { isAdmin } from '@app/_lib/data/mongo/user'
import { getCacheKey } from '@app/_lib/utils'
/* T_Types */
import { COLLECTION, type T_Option } from '@app/_lib/types'
import { getCollection, insertOrReplace } from '@common/data/mongo/mongo'

export const getIndexes = async (...collections: string[]) => {
    if (!(await isAdmin()))
        throw new PermissionError(ERROR_MESSAGE.UNAUTHORIZED, 'getIndexes()')
    const indexes: Record<string, IndexDescriptionCompact> = {}
    for (const name of collections) {
        const collection = await getCollection(name)
        const index = await collection
            .indexInformation()
            .catch((e) => console.log(name, e))
        if (index) {
            indexes[name] = index
        }
    }
    return indexes
}

export const getSchema = async (...collections: string[]) => {
    if (!(await isAdmin()))
        throw new PermissionError(ERROR_MESSAGE.UNAUTHORIZED, 'getSchema()')
    const schema: Record<string, Document> = {}

    for (const name of collections) {
        const collection = await getCollection(name)
        const info = await collection
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
            schema[name] = info
        }
    }

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
        getCacheKey(COLLECTION.OPTIONS, key),
        async () => {
            const collection = await getCollection<T_Option>(COLLECTION.OPTIONS)
            return await collection
                .findOne({ key })
                .then((result) => (result ? result.value : ''))
        },
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
        throw new PermissionError(ERROR_MESSAGE.UNAUTHORIZED, 'getSchema()')

    return await insertOrReplace(COLLECTION.OPTIONS, { key }, { key, value })
}

export const getSystemOption = async (key: string) => {
    const collection = await getCollection<T_Option>(COLLECTION.OPTIONS)
    return await collection.findOne({ key }).then((result) => {
        if (!result) {
            return null
        }
        return result.value
    })
}

export const insertAbTest = async (
    name: string,
    type: 'a' | 'b',
    time: number,
) => await (await getCollection('abTest')).insertOne({ name, type, time })
