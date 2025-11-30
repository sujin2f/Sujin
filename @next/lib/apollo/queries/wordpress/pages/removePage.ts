'use server'
/* Models */
import Cached from '@sujin/share/model/Cache'
import { client } from '@lib/apollo/apollo-client-server'
/* Utils */
import { getAuthHeader } from '@lib/utils/server/header'
import { getCacheKey } from '@sujin/lib/utils/cache'
/* CONSTANTS */
import { COLLECTION } from '@sujin/lib/constants'
import MUTATION from '@lib/apollo/queries/wordpress/pages/removePage.graphql'

export const removePage = async (slug: string) => {
    Cached.getInstance().flush(getCacheKey(COLLECTION.PAGE, slug))
    return await client
        .mutate({
            mutation: MUTATION,
            variables: { slug },
            context: await getAuthHeader(),
        })
        .then((result) => {
            if (!result.data) {
                return false
            }
            return true
        })
}
