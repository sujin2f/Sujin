import { VERSION } from '@common/constants/helper'
import { COLLECTION } from '@app/_lib/types'
import type { CACHE_KEY } from '@app/_lib/types'

/**
 *
 * @param {COLLECTION} collection
 * @param {(string | number)[]} suffixes
 * @returns {string}
 */
export const getCacheKey = (
    collection: CACHE_KEY,
    ...suffixes: (string | number)[]
): string => {
    const suffix = suffixes?.join('-')

    switch (collection) {
        case COLLECTION.POST:
            return `${VERSION}-post-${suffix}`
        case COLLECTION.PAGE:
            return `${VERSION}-page-${suffix}`
        case COLLECTION.CATEGORY:
            return `${VERSION}-category-${suffix}`
        case COLLECTION.TAG:
            return `${VERSION}-tag-${suffix}`
        case COLLECTION.BACKGROUNDS:
            return `${VERSION}-backgrounds`
    }

    // @todo throw
    return ''
}
