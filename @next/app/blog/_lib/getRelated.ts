'use server'
/* Models */
import { client } from '@lib/utils/apollo-client'
/* CONSTANTS */
import { COLLECTION } from '@sujin/lib/constants'
import { IS_DEV } from '@sujin/share/constants/helper'
import query from '@app/blog/_lib/related.graphql'
/* Utils */
import { gqlRequest } from '@app/_lib/redis'
/* T_Types */
import type { T_ArchivePost } from '@sujin/lib/types'

export const getRelated = async (slug: string): Promise<T_ArchivePost[]> => {
    return await gqlRequest(
        async () =>
            await client
                .query<{ related: T_ArchivePost[] }>({
                    query,
                    variables: {
                        slug,
                    },
                    fetchPolicy: IS_DEV ? 'network-only' : 'cache-first',
                })
                .then((result) => {
                    if (!result.data) return []
                    return result.data.related
                }),
        `${COLLECTION.POST}-${slug}-related`,
    ).catch(() => [])
}
