/* Models */
import Cached from '@sujin/node-cache'
/* CONSTANTS */
import { IS_DEV } from '@sujin/share/constants/helper'
import { DAY_IN_SECONDS } from '@sujin/share/constants/datetime'
import { VERSION } from '@sujin/share/constants/helper'
/* T_Types */
import type { COLLECTION } from '../constants'

/**
 *
 * @param {COLLECTION} collection
 * @param {(string | number | undefined)[]} suffixes
 * @returns {string}
 */
export const getCacheKey = (
    collection: COLLECTION,
    ...suffixes: (string | number | undefined)[]
): string => [VERSION, collection, ...suffixes].filter((v) => v).join('-')

/**
 * @param {COLLECTION} collection
 * @param {(string | number | undefined)[]} keys
 * @param {() => Promise<T>} callback
 * @param {number} ttl
 * @param {boolean} force
 * @returns {Promise<T>}
 * @throws {NoContentError}
 */
const DEFAULT_CACHE_OPTION = {
    ttl: DAY_IN_SECONDS,
    force: IS_DEV,
}
export const cachedRequest = <P extends unknown[], R>(
    callback: (...args: P) => Promise<R>,
    cacheKey: string,
    option: { ttl?: number; force?: boolean } = DEFAULT_CACHE_OPTION,
): ((...args: P) => Promise<R>) => {
    return async (...args: P) =>
        await Cached.getInstance().getOrExecute(cacheKey, callback(...args), {
            ...DEFAULT_CACHE_OPTION,
            ...option,
        })
}
