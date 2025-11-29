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
import MUTATION from '@lib/apollo/queries/wordpress/posts/refreshPosts.graphql'

export const refreshPosts = async (page: number, slug: string) => {
    await Cached.getInstance().flush(getCacheKey(COLLECTION.ARCHIVE, 'posts'))
    revalidateTag(COLLECTION.ARCHIVE)
    return await client
        .mutate({
            mutation: MUTATION,
            variables: {
                slug,
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
