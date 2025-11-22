'use server'
import { client } from '@lib/apollo/apollo-client-server'
import { getAuthHeader } from '@lib/utils/server'
import SINGLE_MUTATION from '@lib/apollo/queries/wordpress/posts/refreshPost.graphql'

export const refreshPost = async (slug: string) => {
    return await client
        .mutate({
            mutation: SINGLE_MUTATION,
            variables: { slug },
            context: await getAuthHeader(),
        })
        .then((result) => {
            if (!result.data) {
                return false
            }
            return true
        })
}
