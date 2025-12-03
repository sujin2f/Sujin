'use server'
/* Models */
import { client } from '@lib/utils/apollo-client'
/* CONSTANTS */
import QUERY from '@lib/apollo/queries/wordpress/posts/prevNext.graphql'
import { IS_DEV } from '@sujin/share/constants/helper'
/* T_Types */
import type { T_PrevNext } from '@sujin/lib/types'

export const prevNext = async (slug: string): Promise<T_PrevNext[]> => {
    return await client
        .query<{ prevNext: T_PrevNext[] }>({
            query: QUERY,
            variables: {
                slug,
            },
            fetchPolicy: IS_DEV ? 'network-only' : 'cache-first',
        })
        .then((result) => {
            if (!result.data) return []
            return result.data.prevNext
        })
}
