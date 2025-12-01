'use server'
/* Models */
import { client } from '@lib/apollo/apollo-client-server'
/* Utils */
import { getAuthHeader } from '@lib/utils/server/header'
import { removeCache } from '@lib/utils/redis'
/* CONSTANTS */
import MUTATION from '@lib/apollo/queries/wordpress/archives/refreshCategory.graphql'
import { ARCHIVE, COLLECTION } from '@sujin/lib/constants'

export const refreshCategory = async (slug: string) => {
    return await client
        .mutate({
            mutation: MUTATION,
            variables: {
                slug,
            },
            context: await getAuthHeader(),
        })
        .then(async (result) => {
            if (!result.data) {
                return false
            }

            await removeCache(COLLECTION.ARCHIVE, ARCHIVE.CATEGORY, slug)
            return true
        })
}
