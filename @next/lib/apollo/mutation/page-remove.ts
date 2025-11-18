'use server'
import { client } from '@lib/apollo/apollo-client-server'
import { getSessionContext } from '@lib/utils/session'
import { POST_TYPE } from '@sujin/lib/constants'
import REMOVE_MUTATION from '@lib/apollo/gql/single.remove.graphql'

export const removePage = async (slug: string) => {
    return await client
        .mutate({
            mutation: REMOVE_MUTATION,
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
