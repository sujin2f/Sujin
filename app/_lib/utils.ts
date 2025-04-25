import { VERSION } from '@common/constants/helper'
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
