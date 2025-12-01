'use server'
/* Models */
import { client } from '@lib/apollo/apollo-client-server'
/* Utils */
import { removeCache } from '@lib/utils/redis'
import { getAuthHeader } from '@lib/utils/server/header'
/* CONSTANTS */
import { COLLECTION } from '@sujin/lib/constants'
import MUTATION from '@lib/apollo/queries/wordpress/posts/refreshPosts.graphql'

export const refreshPosts = async (page: number, slug: string) => {
    return await client
        .mutate({
            mutation: MUTATION,
            variables: {
                slug,
                page,
            },
            context: await getAuthHeader(),
        })
        .then(async (result) => {
            if (!result.data) {
                return false
            }
            await removeCache(COLLECTION.POST)
            return true
        })
}
