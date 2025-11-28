'use server'
/* Models */
import { client } from '@lib/apollo/apollo-client-server'
/* CONSTANTS */
import QUERY from '@lib/apollo/queries/wordpress/archives/tag.graphql'
/* T_Types */
import type { T_Archive } from '@sujin/lib/types'

export const tag = async (slug: string): Promise<T_Archive> => {
    return await client
        .query<{ tag: T_Archive }>({
            query: QUERY,
            variables: { slug },
        })
        .then((result) => {
            if (!result.data) {
                throw new Error(`🤬 Cannot find the tag with ${slug}`)
            }
            return result.data.tag
        })
}
