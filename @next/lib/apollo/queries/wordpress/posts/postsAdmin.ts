'use server'
import { client } from '@lib/apollo/apollo-client-server'
import GQL_QUERY from '@lib/apollo/queries/wordpress/posts/postsAdmin.graphql'
import { getAuthHeader } from '@lib/utils/server'
import type { T_ArchivePost } from '@sujin/lib/types'

export const postsAdmin = async (slug: string, page: number): Promise<T_ArchivePost[]> => {
    return await client
        .query<{ postsAdmin: T_ArchivePost[] }>({
            query: GQL_QUERY,
            variables: { slug, page },
            context: await getAuthHeader(),
            fetchPolicy: 'network-only',
        })
        .then((result) => {
            if (!result.data) return []
            return result.data.postsAdmin
        })
}
