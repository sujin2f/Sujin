'use server'
/* Models */
import { client } from '@lib/apollo/apollo-client-server'
/* Utils */
import { getAuthHeader } from '@lib/utils/server/header'
import { removeCache } from '@lib/utils/redis'
/* CONSTANTS */
import { COLLECTION } from '@sujin/lib/constants'
import MUTATION from '@lib/apollo/queries/wordpress/posts/refreshPostsAll.graphql'

export const refreshPostsAll = async (page: number) => {
    return await client
        .mutate({
            mutation: MUTATION,
            variables: {
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
