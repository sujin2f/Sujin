'use server'
import { client } from '@app/_lib/graphql/client'
import GQL_QUERY from '@lib/apollo/queries/wordpress/posts/postsAllAdmin-gql.graphql'
import { getAuthHeader } from '@app/_lib/utils/tokens'
import type { T_ArchivePost } from '@sujin/lib/types'

export const postsAllAdmin = async (page: number): Promise<T_ArchivePost[]> => {
    return await client
        .query<{ postsAllAdmin: T_ArchivePost[] }>({
            query: GQL_QUERY,
            variables: { page },
            context: await getAuthHeader(),
            fetchPolicy: 'network-only',
        })
        .then((result) => {
            if (!result.data) return []
            return result.data.postsAllAdmin
        })
}
