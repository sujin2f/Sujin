'use server'
import { client } from '@lib/apollo/apollo-client-server'
import IS_ADMIN from '@lib/apollo/queries/users/isAdmin.graphql'
import { getAuthHeader } from '@lib/utils/server'

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
