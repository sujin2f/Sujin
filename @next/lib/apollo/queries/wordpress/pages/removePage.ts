'use server'
/* Models */
import { client } from '@lib/apollo/apollo-client-server'
/* Utils */
import { getAuthHeader } from '@lib/utils/server/header'
import { removeCache } from '@lib/redis'
/* CONSTANTS */
import { COLLECTION } from '@sujin/lib/constants'
import MUTATION from '@lib/apollo/queries/wordpress/pages/removePage.graphql'

export const removePage = async (slug: string) => {
    return await client
        .mutate({
            mutation: MUTATION,
            variables: { slug },
            context: await getAuthHeader(),
        })
        .then(async (result) => {
            if (!result.data) {
                return false
            }
            await removeCache(COLLECTION.PAGE, slug)
            return true
        })
}
