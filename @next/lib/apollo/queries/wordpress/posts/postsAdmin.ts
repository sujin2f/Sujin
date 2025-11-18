'use server'
import { client } from '@lib/apollo/apollo-client-server'
import GQL_QUERY from '@lib/apollo/queries/wordpress/posts/postsAdmin.graphql'
import { getSessionContext } from '@lib/utils/session'
import type { T_ArchivePost } from '@sujin/lib/types'

export const postsAdmin = async (
    slug: string,
    page: number,
): Promise<T_ArchivePost[]> => {
    return await client
        .query<{ postsAdmin: T_ArchivePost[] }>({
            query: GQL_QUERY,
            variables: { slug, page },
            context: await getSessionContext(),
        })
        .then((result) => {
            if (!result.data) return []
            return result.data.postsAdmin
        })
}
