'use server'
import { gql } from '@apollo/client'

import { client } from '@lib/apollo/apollo-client-server'
import { getSessionContext } from '@lib/apollo/admin'

export const removePage = async (slug: string) => {
    return await client
        .mutate({
            mutation: gql`
                mutation RemovePage($slug: String!) {
                    removePage(slug: $slug) {
                        result
                    }
                }
            `,
            variables: {
                slug,
            },
            context: await getSessionContext(),
        })
        .then((result) => {
            if (!result.data) {
                return false
            }
            return true
        })
}
