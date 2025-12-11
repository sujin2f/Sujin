'use server'
/* Models */
import { client } from '@lib/utils/apollo-client'
import { Logger } from '@sujin/share/model/Logger'
/* CONSTANTS */
import query from '@app/about/_lib/getPage.graphql'
import { IS_DEV } from '@sujin/share/constants/helper'
import { COLLECTION } from '@sujin/lib/constants'
/* Utils */
import { gqlRequest } from '@app/_lib/redis'
/* T_Types */
import type { T_Page } from '@sujin/lib/types'
import type { Nullable } from '@sujin/share/types'

export const getPage = async (slug: string): Promise<Nullable<T_Page>> => {
    return await gqlRequest(
        async () =>
            await client
                .query<{ page: T_Page }>({
                    query,
                    variables: { slug },
                    fetchPolicy: IS_DEV ? 'network-only' : 'cache-first',
                })
                .then((result) => {
                    if (!result.data || !result.data.page.slug) {
                        Logger.error(`🤬 page query failed! ${slug}`)
                        return
                    }
                    Logger.info(`⭐️ page query done! ${slug}`)
                    return result.data.page
                }),
        `${COLLECTION.PAGE}-about`,
    )
}
