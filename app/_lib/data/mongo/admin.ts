import type { Document, IndexDescriptionCompact } from 'mongodb'
/* Models */
import Cached from '@common/model/Cached'
import { ERROR_MESSAGE, ServerError } from '@app/_lib/constants-error'
/* CONSTANTS */
import { IS_DEV } from '@common/constants/helper'
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
/* Utils */
import { isAdmin } from '@app/_lib/data/mongo/user'
import { getCacheKey } from '@app/_lib/utils'
/* T_Types */
import { CACHE_KEY, COLLECTION, type T_Option } from '@app/_lib/types'
import { getCollection, insertOrReplace } from '@common/data/mongo/mongo'

export const getIndexes = async (...collections: string[]) => {
    if (!(await isAdmin()))
        throw new ServerError(
            ERROR_MESSAGE.GENERAL.UNAUTHORIZED,
            'getIndexes()',
        )
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
        throw new ServerError(ERROR_MESSAGE.GENERAL.UNAUTHORIZED, 'getSchema()')
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
        getCacheKey(CACHE_KEY.OPTIONS, key),
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
        throw new ServerError(
            ERROR_MESSAGE.GENERAL.UNAUTHORIZED,
            'setSystemOption()',
        )

    return await insertOrReplace<T_Option>(
        COLLECTION.OPTIONS,
        { key },
        { key, value },
    )
}

export const insertAbTest = async (
    name: string,
    type: 'a' | 'b',
    time: number,
) => await (await getCollection('abTest')).insertOne({ name, type, time })
