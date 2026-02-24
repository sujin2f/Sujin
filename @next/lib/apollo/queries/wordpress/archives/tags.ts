'use server'
import { client } from '@app/_lib/graphql/client'
import { getAuthHeader } from '@app/_lib/utils/tokens'
import TAG_LIST from '@lib/apollo/queries/wordpress/archives/tags-gql.graphql'
import type { T_Archive } from '@sujin/lib/types'

export const tags = async (page: number): Promise<T_Archive[]> => {
    return await client
        .query<{ tags: T_Archive[] }>({
            query: TAG_LIST,
            variables: { page },
            context: await getAuthHeader(),
            fetchPolicy: 'network-only',
        })
        .then((result) => {
            if (!result.data) {
                return []
            }
            return result.data.tags
        })
}
