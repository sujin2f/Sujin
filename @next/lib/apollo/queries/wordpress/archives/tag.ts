'use server'
/* Models */
import { client } from '@lib/utils/apollo-client'
/* CONSTANTS */
import QUERY from '@lib/apollo/queries/wordpress/archives/tag.graphql'
import { IS_DEV } from '@sujin/share/constants/helper'
/* T_Types */
import type { T_Archive } from '@sujin/lib/types'

export const tag = async (slug: string): Promise<T_Archive> => {
    return await client
        .query<{ tag: T_Archive }>({
            query: QUERY,
            variables: { slug },
            fetchPolicy: IS_DEV ? 'network-only' : 'cache-first',
        })
        .then((result) => {
            if (!result.data) {
                throw new Error(`🤬 Cannot find the tag with ${slug}`)
            }
            return result.data.tag
        })
}
