'use server'
/* Models */
import { client } from '@app/_lib/graphql/client'
/* CONSTANTS */
import QUERY from '@lib/apollo/queries/wordpress/posts/search-gql.graphql'
import { IS_DEV } from '@common/constants/helper'
/* T_Types */
import type { T_ArchivePost, WithNumPages } from '@common/types'

export const search = async (keyword: string, page: number): Promise<WithNumPages<T_ArchivePost, 'items'>> => {
    return await client
        .query<{ search: WithNumPages<T_ArchivePost, 'items'> }>({
            query: QUERY,
            variables: {
                keyword,
                page,
            },
            fetchPolicy: IS_DEV ? 'network-only' : 'cache-first',
        })
        .then((result) => {
            if (!result.data) {
                throw new Error(`🤬 Cannot search the posts with keyword ${keyword}, page ${page}`)
            }
            return result.data.search
        })
}
