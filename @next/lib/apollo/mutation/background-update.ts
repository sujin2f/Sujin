'use server'
import { client } from '@lib/apollo/apollo-client-server'
import { getSessionContext } from '@lib/apollo/admin'
/* CONSTANTS */
import BACKGROUND_MUTATION from '@lib/apollo/gql/background.update.graphql'

export const updateBackgrounds = async () => {
    return await client
        .mutate({
            mutation: BACKGROUND_MUTATION,
            context: await getSessionContext(),
        })
        .then((result) => {
            if (!result.data) {
                return false
            }
            return true
        })
}
