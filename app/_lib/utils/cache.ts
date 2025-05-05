/* Models */
import Cached from '@common/model/Cached'
/* CONSTANTS */
import { IS_DEV } from '@common/constants/helper'
import { DAY_IN_SECONDS } from '@common/constants/datetime'
import { VERSION } from '@common/constants/helper'
/* T_Types */
import type { COLLECTION } from '@app/_lib/types'

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

export const cachedRequest = <P extends unknown[], R>(
    callback: (...args: P) => Promise<R>,
    cacheKey: string,
    option: { ttl?: number; force?: boolean } = {
        ttl: DAY_IN_SECONDS,
        force: IS_DEV,
    },
): ((...args: P) => Promise<R>) => {
    return async (...args: P) =>
        await Cached.getInstance().getOrExecute(
            cacheKey,
            callback(...args),
            option,
        )
}
