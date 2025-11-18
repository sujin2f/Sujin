'use server'
import { client } from '@lib/apollo/apollo-client-server'
import { getSessionContext } from '@lib/utils/session'
/* CONSTANTS */
import REFRESH_MUTATION from '@lib/apollo/queries/wordpress/backgrounds/backgrounds.refresh.graphql'

export const updateBackgrounds = async () => {
    return await client
        .mutate({
            mutation: REFRESH_MUTATION,
            context: await getSessionContext(),
        })
        .then((result) => {
            if (!result.data) {
                return false
            }
            return true
        })
}
