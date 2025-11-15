'use server'
import { gql } from '@apollo/client'

import { client } from '@lib/apollo/apollo-client-server'
import { getSessionContext } from '@lib/apollo/admin'

export const mutateBackgrounds = async () => {
    return await client
        .mutate({
            mutation: gql`
                mutation {
                    updateBackground
                }
            `,
            context: await getSessionContext(),
        })
        .then((result) => {
            if (!result.data) {
                return false
            }
            return true
        })
}
