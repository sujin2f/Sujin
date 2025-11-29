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
import MUTATION from '@lib/apollo/queries/wordpress/archives/removeCategory.graphql'

export const removeCategory = async (slug: string) => {
    await Cached.getInstance().flush(getCacheKey(COLLECTION.ARCHIVE, 'category', slug))
    revalidateTag(COLLECTION.ARCHIVE)
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
