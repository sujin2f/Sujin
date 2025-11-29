'use server'
import { client } from '@lib/apollo/apollo-client-server'
import GQL_QUERY from '@lib/apollo/queries/wordpress/pages/pages.graphql'
import { getAuthHeader } from '@lib/utils/server/header'
import type { T_ArchivePost } from '@sujin/lib/types'

export const pages = async (page: number): Promise<T_ArchivePost[]> => {
    return await client
        .query<{ pages: T_ArchivePost[] }>({
            query: GQL_QUERY,
            variables: { page },
            context: await getAuthHeader(),
            fetchPolicy: 'network-only',
        })
        .then((result) => {
            if (!result.data) return []
            return result.data.pages
        })
}
