'use server'
import { client } from '@lib/apollo/apollo-client-server'
import { getSessionContext } from '@lib/utils/session'
import SINGLE_MUTATION from '@lib/apollo/queries/wordpress/pages/refreshPage.graphql'

export const refreshPage = async (slug: string) => {
    return await client
        .mutate({
            mutation: SINGLE_MUTATION,
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
