import { client } from '@lib/apollo/apollo-client-server'
import LOGIN from '@lib/constants/gql/login.graphql'

export const login = async (email: string) => {
    return await client
        .mutate<{ login: string }>({
            mutation: LOGIN,
            variables: {
                email,
            },
        })
        .then((result) => {
            return result.data?.login
        })
}
