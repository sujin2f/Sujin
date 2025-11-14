'use server'
import { gql } from '@apollo/client'
/* Models */
import { client } from '@lib/apollo/apollo-client-server'
/* CONSTANTS */
import { type T_Archive } from '@sujin/lib/types'
/* Utils */

export const updateHits = async (slug: string) => {
    return await client
        .mutate<{ archive: T_Archive }>({
            mutation: gql`
                query UpdateHits($slug: String!) {
                    updateHits(slug: $slug) {
                        result
                    }
                }
            `,
            variables: {
                slug,
            },
        })
        // TODO Log
        .catch(() => {})
}
