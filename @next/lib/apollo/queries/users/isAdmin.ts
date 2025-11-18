'use server'
import { client } from '@lib/apollo/apollo-client-server'
import IS_ADMIN from '@lib/apollo/queries/users/isAdmin.graphql'
import { getSessionContext } from '@lib/utils/session'

export const isAdmin = async (): Promise<boolean> => {
    return await client
        .mutate<boolean>({
            mutation: IS_ADMIN,
            context: await getSessionContext(),
        })
        .then((result) => {
            if (!result || !result.data) {
                return false
            }
            return result.data
        })
        .catch(() => false)
}
