'use server'
/* Models */
import { client } from '@lib/utils/apollo-client'
/* CONSTANTS */
import query from '@app/archive/_lib/posts.graphql'
import { ARCHIVE, COLLECTION } from '@sujin/lib/constants'
import { IS_DEV } from '@sujin/share/constants/helper'
/* T_Types */
import type { T_ArchivePost, WithNumPages } from '@sujin/lib/types'
/* Utils */
import { gqlRequest } from '@app/_lib/redis'

export const getPosts = async (
    type: ARCHIVE,
    slug: string,
    page: number,
): Promise<WithNumPages<T_ArchivePost, 'items'>> => {
    return await gqlRequest(
        async () =>
            await client
                .query<{ posts: WithNumPages<T_ArchivePost, 'items'> }>({
                    query,
                    variables: { type, slug, page },
                    fetchPolicy: IS_DEV ? 'network-only' : 'cache-first',
                })
                .then((result) => {
                    if (!result.data) {
                        throw new Error(`🤬 Cannot find the posts from ${type} ${slug}, page ${page}`)
                    }
                    return result.data.posts
                }),
        `${COLLECTION.POST}-archive-${type}-${slug}-${page}`,
    )
}
