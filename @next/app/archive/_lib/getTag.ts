'use server'
/* Models */
import { client } from '@app/_lib/graphql/client'
import { Logger } from '@sujin/share/model/Logger'
/* CONSTANTS */
import query from '@app/archive/_lib/getTag-gql.graphql'
import { IS_DEV } from '@sujin/share/constants/helper'
import { COLLECTION } from '@sujin/lib/constants'
/* Utils */
import { gqlRequest } from '@app/_lib/utils/redis'
/* T_Types */
import type { T_Archive } from '@sujin/lib/types'
import type { Nullable } from '@sujin/share/types'

export const getTag = async (slug: string): Promise<Nullable<T_Archive>> => {
    return await gqlRequest(
        async () =>
            await client
                .query<{ tag: T_Archive }>({
                    query,
                    variables: { slug },
                    fetchPolicy: IS_DEV ? 'network-only' : 'cache-first',
                })
                .then((result) => {
                    if (!result.data || !result.data.tag.slug) {
                        Logger.error(`🤬 tag query failed! ${slug}`)
                        return
                    }
                    Logger.info(`⭐️ tag query done! ${slug}`)
                    return result.data.tag
                }),
        `${COLLECTION.ARCHIVE}-tag-${slug}`,
    )
}
