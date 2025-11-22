'use server'
import { client } from '@lib/apollo/apollo-client-server'
import { getAuthHeader } from '@lib/utils/server'
import CATEGORY_MUTATION from '@lib/apollo/queries/wordpress/archives/refreshCategory.graphql'

export const refreshCategory = async (slug: string) => {
    return await client
        .mutate({
            mutation: CATEGORY_MUTATION,
            variables: {
                slug,
            },
            context: await getAuthHeader(),
        })
        .then((result) => {
            if (!result.data) {
                return false
            }
            return true
        })
}
