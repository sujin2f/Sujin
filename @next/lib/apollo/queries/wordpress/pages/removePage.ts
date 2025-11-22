'use server'
import { client } from '@lib/apollo/apollo-client-server'
import { getAuthHeader } from '@lib/utils/server'
import REMOVE_MUTATION from '@lib/apollo/queries/wordpress/pages/removePage.graphql'

export const removePage = async (slug: string) => {
    return await client
        .mutate({
            mutation: REMOVE_MUTATION,
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
