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

export const cachedRequest = async <T>(
    collection: COLLECTION,
    keys: (string | number | undefined)[],
    callback: () => Promise<T>,
    ttl: number = DAY_IN_SECONDS,
    force: boolean = IS_DEV,
): Promise<T> =>
    await Cached.getInstance().getOrExecute(
        getCacheKey(collection, ...keys),
        callback,
        ttl,
        force,
    )
