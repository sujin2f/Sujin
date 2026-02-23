'use server'
/* Models */
import { client } from '@lib/utils/apollo-client'
import { Logger } from '@sujin/share/model/Logger'
/* CONSTANTS */
import query from '@app/archive/_lib/getPosts-gql.graphql'
import { ARCHIVE, COLLECTION } from '@sujin/lib/constants'
import { IS_DEV } from '@sujin/share/constants/helper'
/* T_Types */
import type { T_ArchivePost, WithNumPages } from '@sujin/lib/types'
import type { Nullable } from '@sujin/share/types'
/* Utils */
import { gqlRequest } from '@app/_lib/utils/redis'

export const getPosts = async (
    type: ARCHIVE,
    slug: string,
    page: number,
): Promise<Nullable<WithNumPages<T_ArchivePost, 'items'>>> => {
    return await gqlRequest(
        async () =>
            await client
                .query<{ posts: WithNumPages<T_ArchivePost, 'items'> }>({
                    query,
                    variables: { type, slug, page },
                    fetchPolicy: IS_DEV ? 'network-only' : 'cache-first',
                })
                .then((result) => {
                    if (!result.data || !result.data.posts.items.length) {
                        Logger.error(`🤬 posts query failed with ${type} ${slug} ${page}`)
                        return
                    }
                    Logger.info(`⭐️ posts query done with ${type} ${slug} ${page}`)
                    return result.data.posts
                }),
        `${COLLECTION.POST}-archive-${type}-${slug}-${page}`,
    )
}
