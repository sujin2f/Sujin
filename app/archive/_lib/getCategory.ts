'use server'
/* Models */
import { client } from '@app/_lib/graphql/client'
import { Logger } from '@common/model/Logger'
/* CONSTANTS */
import query from '@app/archive/_lib/getCategory-gql.graphql'
import { IS_DEV } from '@common/constants/helper'
import { COLLECTION } from '@common/constants'
/* Utils */
import { gqlRequest } from '@app/_lib/utils/redis'
/* T_Types */
import type { T_Archive } from '@common/types'
import type { Nullable } from '@common/types'

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
                        Logger.error(`category query failed! ${slug}`)
                        return
                    }
                    Logger.info(`category query done! ${slug}`)
                    return result.data.category
                }),
        `${COLLECTION.ARCHIVE}-category-${slug}`,
    )
}
