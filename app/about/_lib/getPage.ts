'use server'
/* Models */
import { client } from '@app/_lib/graphql/client'
import { Logger } from '@common/model/Logger'
/* CONSTANTS */
import query from '@app/about/_lib/getPage-gql.graphql'
import { IS_DEV } from '@common/constants/helper'
import { COLLECTION } from '@common/constants'
/* Utils */
import { gqlRequest } from '@app/_lib/utils/redis'
/* T_Types */
import type { T_Page } from '@common/types'
import type { Nullable } from '@common/types'

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
                        Logger.error(`page query failed! ${slug}`)
                        return
                    }
                    Logger.info(`page query done! ${slug}`)
                    return result.data.page
                }),
        `${COLLECTION.PAGE}-about`,
    )
}
