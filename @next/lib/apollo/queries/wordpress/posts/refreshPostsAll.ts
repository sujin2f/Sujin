'use server'
import { client } from '@lib/apollo/apollo-client-server'
import { getAuthHeader } from '@lib/utils/server'
import POSTS_MUTATION from '@lib/apollo/queries/wordpress/posts/refreshPostsAll.graphql'

export const refreshPostsAll = async (page: number) => {
    return await client
        .mutate({
            mutation: POSTS_MUTATION,
            variables: {
                page,
            },
            context: await getAuthHeader(),
        })
        .then((result) => {
            if (!result.data) {
                return false
            }
            return true
        })
}
