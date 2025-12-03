'use server'
/* Models */
import { client } from '@lib/utils/apollo-client'
/* CONSTANTS */
import QUERY from '@lib/apollo/queries/wordpress/posts/recent.graphql'
import { IS_DEV } from '@sujin/share/constants/helper'
/* T_Types */
import type { T_ArchivePost } from '@sujin/lib/types'

export const recent = async (): Promise<T_ArchivePost[]> => {
    return await client
        .query<{ recent: T_ArchivePost[] }>({
            query: QUERY,
            fetchPolicy: IS_DEV ? 'network-only' : 'cache-first',
        })
        .then((result) => {
            if (!result.data) return []
            return result.data.recent
        })
}
