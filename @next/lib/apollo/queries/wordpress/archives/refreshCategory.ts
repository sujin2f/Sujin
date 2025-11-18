'use server'
import { client } from '@lib/apollo/apollo-client-server'
import { getSessionContext } from '@lib/utils/session'
import CATEGORY_MUTATION from '@lib/apollo/queries/wordpress/archives/refreshCategory.graphql'

export const refreshCategory = async (slug: string) => {
    return await client
        .mutate({
            mutation: CATEGORY_MUTATION,
            variables: {
                slug,
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
