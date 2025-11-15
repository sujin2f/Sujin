'use server'
import { gql } from '@apollo/client'

import { client } from '@lib/apollo/apollo-client-server'
import { getSessionContext } from '@lib/apollo/admin'

export const removeCategory = async (slug: string) => {
    return await client
        .mutate({
            mutation: gql`
                mutation RemoveCategory($slug: String!) {
                    removeArchive(slug: $slug, archiveType: category)
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
