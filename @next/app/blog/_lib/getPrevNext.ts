'use server'
/* Models */
import { client } from '@app/_lib/graphql/client'
/* CONSTANTS */
import { COLLECTION } from '@sujin/lib/constants'
import query from '@app/blog/_lib/getPrevNext-gql.graphql'
/* Utils */
import { gqlRequest } from '@app/_lib/utils/redis'
import { IS_DEV } from '@sujin/share/constants/helper'
/* T_Types */
import type { T_PrevNext } from '@sujin/lib/types'

export const getPrevNext = async (slug: string): Promise<T_PrevNext[]> => {
    return await gqlRequest(
        async () =>
            await client
                .query<{ prevNext: T_PrevNext[] }>({
                    query,
                    variables: {
                        slug,
                    },
                    fetchPolicy: IS_DEV ? 'network-only' : 'cache-first',
                })
                .then((result) => {
                    if (!result.data) return []
                    return result.data.prevNext
                }),
        `${COLLECTION.POST}-${slug}-prevNext`,
    ).catch(() => [])
}
