'use server'
import { DocumentNode } from '@apollo/client'
import { unstable_cache } from 'next/cache'
/* Models */
import { client } from '@lib/apollo/apollo-client-server'
/* CONSTANTS */
import { REVALIDATION } from '@lib/constants'
import { COLLECTION } from '@sujin/lib/constants'
/* Utils */
import { cachedRequest, getCacheKey } from '@sujin/lib/utils/cache'
import { getSessionContext } from '@lib/utils/session'

// TODO pass function
export const cachedGQLRequest = async <T>(
    doc: DocumentNode,
    variables: Record<string, unknown>,
    cacheKeys: string[],
) => {
    const request = unstable_cache(
        async <T>(
            doc: DocumentNode,
            variables: Record<string, unknown>,
            cacheKeys: string[],
        ) => {
            const [collection, ...keys] = cacheKeys
            const request = cachedRequest(
                GQLRequest,
                getCacheKey(collection as COLLECTION, ...keys),
            )
            return await request<T>(doc, variables)
        },
        cacheKeys,
        {
            revalidate: REVALIDATION,
        },
    )
    return await request<T>(doc, variables, cacheKeys)
}

// const cached =

const GQLRequest = async <T>(
    doc: DocumentNode,
    variables: Record<string, unknown>,
) => {
    return await client.query<T>({
        query: doc,
        variables,
        context: await getSessionContext(),
    })
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export const cachedGQLRequest2 = async <T>(
    func: (...variables: any[]) => Promise<T>,
    token: string,
    cacheKeys: string[],
    ...variables: any[]
) => {
    const request = unstable_cache(cached2, cacheKeys, {
        revalidate: REVALIDATION,
    })
    return await request<T>(func, token, cacheKeys, ...variables)
}

const cached2 = async <T>(
    func: (...variables: any[]) => Promise<T>,
    token: string,
    cacheKeys: string[],
    ...variables: any[]
) => {
    const [collection, ...keys] = cacheKeys
    const request = cachedRequest(
        func,
        getCacheKey(collection as COLLECTION, ...keys),
    )
    return await request(token, ...variables)
}
