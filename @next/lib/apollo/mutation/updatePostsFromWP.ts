'use server'
import { gql } from '@apollo/client'

import { client } from '@lib/apollo/apollo-client-server'
import { getSessionContext } from '@lib/apollo/admin'

export const updatePostsFromWP = async (slug: string, page: number) => {
    return await client
        .mutate({
            mutation: gql`
                mutation UpdatePostsFromWP($slug: String!, $page: Int!) {
                    updatePostsFromWP(slug: $slug, page: $page) {
                        result
                    }
                }
            `,
            variables: {
                slug,
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
