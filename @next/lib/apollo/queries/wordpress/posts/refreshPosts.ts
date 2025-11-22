'use server'
import { client } from '@lib/apollo/apollo-client-server'
import { getAuthHeader } from '@lib/utils/server'
import POSTS_MUTATION from '@lib/apollo/queries/wordpress/posts/refreshPosts.graphql'

export const refreshPosts = async (page: number, slug: string) => {
    return await client
        .mutate({
            mutation: POSTS_MUTATION,
            variables: {
                slug,
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
