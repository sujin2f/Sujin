'use server'
/* Models */
import { client } from '@lib/apollo/apollo-client-server'
/* T_Types */
import type { T_Archive } from '@sujin/lib/types'
/* CONSTANTS */
import HIT_MUTATION from '@lib/apollo/queries/wordpress/archives/updateHits.graphql'

export const updateHits = async (slug: string) => {
    return await client
        .mutate<{ archive: T_Archive }>({
            mutation: HIT_MUTATION,
            variables: { slug },
        })
        // TODO Log
        .catch(() => {})
}
