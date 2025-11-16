'use server'
import { client } from '@lib/apollo/apollo-client-server'
import { getSessionContext } from '@lib/apollo/admin'
import FLUSH_MUTATION from '@lib/constants/gql/flushDB.graphql'

export const flushDB = async () => {
    return await client
        .mutate<{ flushDB: boolean }>({
            mutation: FLUSH_MUTATION,
            context: await getSessionContext(),
        })
        .then((result) => {
            if (!result.data) {
                return false
            }
            return result.data.flushDB
        })
}
