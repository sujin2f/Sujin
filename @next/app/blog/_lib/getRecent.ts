'use server'
/* Models */
import { client } from '@lib/utils/apollo-client'
/* CONSTANTS */
import { COLLECTION } from '@sujin/lib/constants'
import { IS_DEV } from '@sujin/share/constants/helper'
import query from '@app/blog/_lib/getRecent.graphql'
/* Utils */
import { gqlRequest } from '@app/_lib/redis'
/* T_Types */
import type { T_ArchivePost } from '@sujin/lib/types'

export const getRecent = async (): Promise<T_ArchivePost[]> => {
    return await gqlRequest(
        async () =>
            await client
                .query<{ recent: T_ArchivePost[] }>({
                    query,
                    fetchPolicy: IS_DEV ? 'network-only' : 'cache-first',
                })
                .then((result) => {
                    if (!result.data) return []
                    return result.data.recent
                }),
        `${COLLECTION.POST}-recent`,
    ).catch(() => [])
}
