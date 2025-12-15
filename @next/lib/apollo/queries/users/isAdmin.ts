'use server'
import { client } from '@lib/utils/apollo-client'
import IS_ADMIN from '@lib/apollo/queries/users/isAdmin-gql.graphql'
import { getAuthHeader } from '@lib/utils/server/header'

export const isAdmin = async (): Promise<boolean> => {
    return await client
        .mutate<boolean>({
            mutation: IS_ADMIN,
            context: await getAuthHeader(),
        })
        .then((result) => {
            if (!result || !result.data) {
                return false
            }
            return result.data
        })
        .catch(() => false)
}
