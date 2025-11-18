'use server'
import { client } from '@lib/apollo/apollo-client-server'
import GQL_QUERY from '@lib/apollo/queries/wordpress/posts/postsAllAdmin.graphql'
import { getSessionContext } from '@lib/utils/session'
import type { T_ArchivePost } from '@sujin/lib/types'

export const postsAllAdmin = async (page: number): Promise<T_ArchivePost[]> => {
    return await client
        .query<{ postsAllAdmin: T_ArchivePost[] }>({
            query: GQL_QUERY,
            variables: { page },
            context: await getSessionContext(),
        })
        .then((result) => {
            if (!result.data) return []
            return result.data.postsAllAdmin
        })
}
