'use server'
import { client } from '@lib/apollo/apollo-client-server'
import { getSessionContext } from '@lib/utils/session'
import TAG_LIST from '@lib/apollo/queries/wordpress/archives/tags.graphql'
import type { T_Archive } from '@sujin/lib/types'

export const tags = async (page: number): Promise<T_Archive[]> => {
    return await client
        .query<{ tags: T_Archive[] }>({
            query: TAG_LIST,
            variables: { page },
            context: await getSessionContext(),
        })
        .then((result) => {
            if (!result.data) {
                return []
            }
            return result.data.tags
        })
}
