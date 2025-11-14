'use server'
import { gql } from '@apollo/client'

import { client } from '@lib/apollo/apollo-client-server'
import { getSessionContext } from '@lib/apollo/admin'

export const flushDB = async () => {
    return await client
        .mutate<{ flushDB: boolean }>({
            mutation: gql`
                mutation FlushDB {
                    flushDB
                }
            `,
            context: await getSessionContext(),
        })
        .then((result) => {
            if (!result.data) {
                return false
            }
            return result.data.flushDB
        })
}
