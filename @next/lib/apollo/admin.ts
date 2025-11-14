'use server'
import { gql } from '@apollo/client'

import { client } from '@lib/apollo/apollo-client-server'
import { getToken } from '@lib/utils/session'

export const flushDB = async () => {
    const token = await getToken()
    return await client
        .mutate<{ flushDB: boolean }>({
            mutation: gql`
                mutation FlushDB {
                    flushDB
                }
            `,
            context: {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        })
        .then((result) => {
            if (!result.data) {
                return false
            }
            return result.data.flushDB
        })
}
