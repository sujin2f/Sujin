'use server'
import { client } from '@lib/apollo/apollo-client-server'
import { getSessionContext } from '@lib/utils/session'
import POSTS_MUTATION from '@lib/apollo/queries/wordpress/posts/refreshPosts.graphql'

export const refreshPosts = async (page: number, slug: string) => {
    return await client
        .mutate({
            mutation: POSTS_MUTATION,
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
