'use server'
import { gql } from '@apollo/client'

import { client } from '@lib/apollo/apollo-client-server'
import { getSessionContext } from '@lib/apollo/admin'

export const updatePage = async (slug: string) => {
    return await client
        .mutate({
            mutation: gql`
                mutation UpdatePage($slug: String!) {
                    updateSingle(slug: $slug, postType: page)
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
