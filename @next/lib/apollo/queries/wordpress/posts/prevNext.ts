'use server'
import { client } from '@lib/apollo/apollo-client-server'
import query from '@lib/apollo/queries/wordpress/posts/prevNext.graphql'
import type { T_PrevNext } from '@sujin/lib/types'

export const prevNext = async (slug: string): Promise<T_PrevNext[]> => {
    return await client
        .query<{ prevNext: T_PrevNext[] }>({
            query,
            variables: {
                slug,
            },
        })
        .then((result) => {
            if (!result.data) return []
            return result.data.prevNext
        })
}
