'use server'
import { client } from '@lib/utils/apollo-client'
import { getAuthHeader } from '@lib/utils/server/header'
import FLUSH_MUTATION from '@lib/apollo/queries/misc/flushDB.graphql'

export const flushDB = async () => {
    return await client
        .mutate<{ flushDB: boolean }>({
            mutation: FLUSH_MUTATION,
            context: await getAuthHeader(),
        })
        .then((result) => {
            if (!result.data) {
                return false
            }
            return result.data.flushDB
        })
}
