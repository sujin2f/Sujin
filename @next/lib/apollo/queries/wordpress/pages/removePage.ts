'use server'
import { client } from '@lib/apollo/apollo-client-server'
import { getSessionContext } from '@lib/utils/session'
import REMOVE_MUTATION from '@lib/apollo/queries/wordpress/pages/removePage.graphql'

export const removePage = async (slug: string) => {
    return await client
        .mutate({
            mutation: REMOVE_MUTATION,
            variables: { slug },
            context: await getSessionContext(),
        })
        .then((result) => {
            if (!result.data) {
                return false
            }
            return true
        })
}
