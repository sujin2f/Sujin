'use server'
/* Models */
import { client } from '@lib/apollo/apollo-client-server'
/* CONSTANTS */
import QUERY from '@lib/apollo/queries/wordpress/archives/category.graphql'
/* T_Types */
import type { T_Archive } from '@sujin/lib/types'

export const category = async (slug: string): Promise<T_Archive> => {
    return await client
        .query<{ category: T_Archive }>({
            query: QUERY,
            variables: { slug },
        })
        .then((result) => {
            if (!result.data) {
                throw new Error(`🤬 Cannot find the category with ${slug}`)
            }
            return result.data.category
        })
}
