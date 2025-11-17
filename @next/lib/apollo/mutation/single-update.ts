'use server'
import { client } from '@lib/apollo/apollo-client-server'
import { getSessionContext } from '@lib/apollo/admin'
import SINGLE_MUTATION from '@lib/apollo/gql/single.update.graphql'
import { POST_TYPE } from '@sujin/lib/constants'

export const updateSingle = async (slug: string, postType: POST_TYPE) => {
    return await client
        .mutate({
            mutation: SINGLE_MUTATION,
            variables: {
                slug,
                postType,
            },
            context: await getSessionContext(),
        })
        .then((result) => {
            if (!result.data) {
                return false
            }
            return true
        })
}
