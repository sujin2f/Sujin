'use server'
import { revalidateTag } from 'next/cache'
/* Models */
import Cached from '@sujin/share/model/Cache'
import { client } from '@lib/apollo/apollo-client-server'
/* Utils */
import { getAuthHeader } from '@lib/utils/server/header'
import { getCacheKey } from '@sujin/lib/utils/cache'
/* CONSTANTS */
import { COLLECTION } from '@sujin/lib/constants'
import MUTATION from '@lib/apollo/queries/wordpress/posts/refreshPostsAll.graphql'

export const refreshPostsAll = async (page: number) => {
    await Cached.getInstance().flush(getCacheKey(COLLECTION.ARCHIVE, 'posts'))
    await Cached.getInstance().flush(getCacheKey(COLLECTION.POST)) // TODO return updated post slugs and flush them
    revalidateTag(COLLECTION.ARCHIVE)
    revalidateTag(COLLECTION.POST)

    return await client
        .mutate({
            mutation: MUTATION,
            variables: {
                page,
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
