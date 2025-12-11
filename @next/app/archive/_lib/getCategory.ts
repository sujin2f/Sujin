'use server'
/* Models */
import { client } from '@lib/utils/apollo-client'
import { Logger } from '@sujin/share/model/Logger'
/* CONSTANTS */
import query from '@app/archive/_lib/getCategory.graphql'
import { IS_DEV } from '@sujin/share/constants/helper'
import { COLLECTION } from '@sujin/lib/constants'
/* Utils */
import { gqlRequest } from '@app/_lib/redis'
/* T_Types */
import type { T_Archive } from '@sujin/lib/types'
import type { Nullable } from '@sujin/share/types'

export const getCategory = async (slug: string): Promise<Nullable<T_Archive>> => {
    return await gqlRequest(
        async () =>
            await client
                .query<{ category: T_Archive }>({
                    query,
                    variables: { slug },
                    fetchPolicy: IS_DEV ? 'network-only' : 'cache-first',
                })
                .then((result) => {
                    if (!result.data || !result.data.category.slug) {
                        Logger.error(`🤬 category query failed! ${slug}`)
                        return
                    }
                    Logger.info(`⭐️ category query done! ${slug}`)
                    return result.data.category
                }),
        `${COLLECTION.ARCHIVE}-category-${slug}`,
    )
}
