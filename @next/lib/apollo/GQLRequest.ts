'use server'
import { DocumentNode } from 'graphql'
import { unstable_cache } from 'next/cache'
/* Models */
import { client } from '@lib/apollo/apollo-client-server'
/* CONSTANTS */
import { REVALIDATION } from '@lib/constants'
import { COLLECTION } from '@sujin/lib/constants'
/* Utils */
import { cachedRequest, getCacheKey } from '@sujin/lib/utils/cache'
import { getSessionContext } from '@lib/apollo/admin'

export const cachedGQLRequest = async <T>(
    doc: DocumentNode,
    variables: Record<string, unknown>,
    cacheKeys: string[],
) => {
    const request = unstable_cache(cached, cacheKeys, {
        revalidate: REVALIDATION,
    })
    return await request<T>(doc, variables, cacheKeys)
}

const cached = async <T>(
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
}

export const GQLRequest = async <T>(
    doc: DocumentNode,
    variables: Record<string, unknown>,
) => {
    return await client.query<T>({
        query: doc,
        variables,
        context: await getSessionContext(),
    })
}
