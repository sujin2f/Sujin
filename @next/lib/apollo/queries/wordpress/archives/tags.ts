'use server'
import { client } from '@lib/utils/apollo-client'
import { getAuthHeader } from '@lib/utils/server/header'
import TAG_LIST from '@lib/apollo/queries/wordpress/archives/tags.graphql'
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
