'use server'
import { client } from '@lib/apollo/apollo-client-server'
import { getSessionContext } from '@lib/apollo/admin'
import SINGLE_MUTATION from '@lib/constants/gql/updateSingle.graphql'
import { POST_TYPE } from '@sujin/lib/constants'

export const updatePage = async (slug: string) => {
    return await client
        .mutate({
            mutation: SINGLE_MUTATION,
            variables: {
                slug,
                postType: POST_TYPE.PAGE,
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
