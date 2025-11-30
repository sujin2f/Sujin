'use server'
/* Models */
import { client } from '@lib/apollo/apollo-client-server'
/* CONSTANTS */
import QUERY from '@lib/apollo/queries/wordpress/posts/posts.graphql'
import { ARCHIVE } from '@sujin/lib/constants'
import { IS_DEV } from '@sujin/share/constants/helper'
/* T_Types */
import type { T_ArchivePost, WithNumPages } from '@sujin/lib/types'

export const posts = async (
    type: ARCHIVE,
    slug: string,
    page: number,
): Promise<WithNumPages<T_ArchivePost, 'items'>> => {
    return await client
        .query<{ posts: WithNumPages<T_ArchivePost, 'items'> }>({
            query: QUERY,
            variables: { type, slug, page },
            fetchPolicy: IS_DEV ? 'network-only' : 'cache-first',
        })
        .then((result) => {
            if (!result.data) {
                throw new Error(`🤬 Cannot find the posts from ${type} ${slug}, page ${page}`)
            }
            return result.data.posts
        })
}
