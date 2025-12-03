'use server'
/* Models */
import { client } from '@lib/utils/apollo-client'
/* CONSTANTS */
import QUERY from '@lib/apollo/queries/wordpress/posts/related.graphql'
import { IS_DEV } from '@sujin/share/constants/helper'
/* T_Types */
import type { T_ArchivePost } from '@sujin/lib/types'

export const related = async (slug: string): Promise<T_ArchivePost[]> => {
    return await client
        .query<{ related: T_ArchivePost[] }>({
            query: QUERY,
            variables: {
                slug,
            },
            fetchPolicy: IS_DEV ? 'network-only' : 'cache-first',
        })
        .then((result) => {
            if (!result.data) return []
            return result.data.related
        })
}
