'server-only'
import { DocumentNode } from '@apollo/client'
import { unstable_cache } from 'next/cache'
/* Models */
import { client } from '@lib/apollo/apollo-client-server'
/* CONSTANTS */
import { REVALIDATION } from '@lib/constants'
import { COLLECTION } from '@sujin/lib/constants'
/* Utils */
import { cachedRequest, getCacheKey } from '@sujin/lib/utils/cache'
import { DAY_IN_SECONDS } from '@sujin/share/constants/datetime'
import { IS_DEV } from '@sujin/share/constants/helper'

// TODO pass function
export const cachedGQLRequest = async <T>(
    doc: DocumentNode,
    variables: Record<string, unknown>,
    cacheKeys: string[],
) => {
    const request = unstable_cache(
        async <T>(doc: DocumentNode, variables: Record<string, unknown>, cacheKeys: string[]) => {
            const [collection, ...keys] = cacheKeys
            const request = cachedRequest(GQLRequest, getCacheKey(collection as COLLECTION, ...keys))
            return await request<T>(doc, variables)
        },
        cacheKeys,
        {
            revalidate: REVALIDATION,
        },
    )
    return await request<T>(doc, variables, cacheKeys)
}

const GQLRequest = async <T>(doc: DocumentNode, variables: Record<string, unknown>) => {
    return await client.query<T>({
        query: doc,
        variables,
    })
}

/**
 * Pass promise and keep it in Next cache with unstable_cache
 *
 * @param promise Promise to execute
 * @param keys    Cache keys
 * @returns
 */
export const nextCachedRequest = async <T>(promise: Promise<T>, ...keys: string[]) => {
    const request = unstable_cache(nodeCachedRequest, keys, {
        revalidate: REVALIDATION,
    })
    return await request<T>(promise, ...keys)
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
