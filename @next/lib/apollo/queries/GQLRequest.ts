'server-only'
import { unstable_cache } from 'next/cache'
/* CONSTANTS */
import { REVALIDATION } from '@lib/constants'
import { COLLECTION } from '@sujin/lib/constants'
/* Utils */
import { cachedRequest, getCacheKey } from '@sujin/lib/utils/cache'
import { DAY_IN_SECONDS } from '@sujin/share/constants/datetime'
import { IS_DEV } from '@sujin/share/constants/helper'

/**
 * Pass promise and keep it in Next cache with unstable_cache
 *
 * @param promise Promise to execute
 * @param keys    Cache keys
 * @returns
 */
export const nextCachedRequest = async <T>(promise: Promise<T>, ...tags: string[]) => {
    // TODO API that WP requests removing caches
    const request = unstable_cache(nodeCachedRequest, [], {
        revalidate: REVALIDATION,
        tags, // TODO makes tags to : ['category', 'category-slug', 'category-slug-1']
    })
    return await request<T>(promise, ...tags)
}

/**
 * Pass promise and keep it in Node cache
 *
 * @param promise Promise to execute
 * @param keys    Cache keys
 * @returns
 */
export const nodeCachedRequest = async <T>(promise: Promise<T>, ...keys: string[]) => {
    const [collection, ...key] = keys
    const request = cachedRequest(async () => await promise, getCacheKey(collection as COLLECTION, ...key), {
        ttl: DAY_IN_SECONDS,
        force: IS_DEV,
    })
    return await request()
}
