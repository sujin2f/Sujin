'use server'
import { client } from '@lib/apollo/apollo-client-server'
import { getSessionContext } from '@lib/utils/session'
import CATEGORY_LIST from '@lib/apollo/queries/wordpress/archives/categories.graphql'
import type { T_Archive } from '@sujin/lib/types'

export const categories = async (page: number): Promise<T_Archive[]> => {
    return await client
        .query<{ categories: T_Archive[] }>({
            query: CATEGORY_LIST,
            variables: { page },
            context: await getSessionContext(),
        })
        .then((result) => {
            if (!result.data) {
                return []
            }
            return result.data.categories
        })
}
