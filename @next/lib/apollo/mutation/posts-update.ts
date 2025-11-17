'use server'
import { client } from '@lib/apollo/apollo-client-server'
import { getSessionContext } from '@lib/apollo/admin'
import POSTS_MUTATION from '@lib/apollo/gql/posts.update.graphql'

export const updatePosts = async (page: number, category: string = '') => {
    return await client
        .mutate({
            mutation: POSTS_MUTATION,
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
