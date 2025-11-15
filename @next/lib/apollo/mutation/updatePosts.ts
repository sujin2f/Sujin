'use server'
import { gql } from '@apollo/client'

import { client } from '@lib/apollo/apollo-client-server'
import { getSessionContext } from '@lib/apollo/admin'

export const updatePosts = async (category: string, page: number) => {
    return await client
        .mutate({
            mutation: gql`
                mutation UpdatePosts($category: String!, $page: Int!) {
                    updatePosts(category: $category, page: $page)
                }
            `,
            variables: {
                category,
                page,
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
