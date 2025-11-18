import { client } from '@lib/apollo/apollo-client-server'
import LOGIN from '@lib/apollo/queries/users/login.graphql'
import type { T_Token_Return } from '@sujin/lib/types'

export const login = async (nextToken: string): Promise<T_Token_Return> => {
    return await client
        .mutate<T_Token_Return>({
            mutation: LOGIN,
            context: {
                headers: {
                    Authorization: `Bearer ${nextToken}`,
                },
            },
        })
        .then((result) => {
            if (!result || !result.data) {
                throw new Error()
            }
            return result.data
        })
        .catch((e) => {
            console.log(e)
            throw e
        })
}
