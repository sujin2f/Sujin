import { gql } from '@apollo/client'

import { client } from '@lib/apollo/apollo-client-server'

export const login = async (email: string) => {
    return await client
        .mutate<{ login: string }>({
            mutation: gql`
                mutation Login($email: String!) {
                    login(email: $email)
                }
            `,
            variables: {
                email,
            },
        })
        .then((result) => {
            return result.data?.login
        })
}
