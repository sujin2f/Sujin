'use server'
import { client } from '@app/_lib/graphql/client'
import GQL_QUERY from '@lib/apollo/queries/wordpress/posts/postsAdmin-gql.graphql'
import { getAuthHeader } from '@app/_lib/utils/tokens'
import type { T_ArchivePost } from '@common/types'

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
