'use server'
/* Models */
import { client } from '@lib/apollo/apollo-client-server'
/* CONSTANTS */
import QUERY from '@lib/apollo/queries/wordpress/posts/search.graphql'
/* T_Types */
import type { T_ArchivePost, WithNumPages } from '@sujin/lib/types'

export const search = async (keyword: string, page: number): Promise<WithNumPages<T_ArchivePost, 'items'>> => {
    return await client
        .query<{ search: WithNumPages<T_ArchivePost, 'items'> }>({
            query: QUERY,
            variables: {
                keyword,
                page,
            },
        })
        .then((result) => {
            if (!result.data) {
                throw new Error(`🤬 Cannot search the posts with keyword ${keyword}, page ${page}`)
            }
            return result.data.search
        })
}
