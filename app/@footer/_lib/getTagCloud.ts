'use server'
/* Models */
import { client } from '@app/_lib/graphql/client'
import { Logger } from '@common/model/Logger'
/* CONSTANTS */
import query from '@app/@footer/_lib/getTagCloud-gql.graphql'
import { IS_DEV } from '@common/constants/helper'
/* T_Types */
import type { T_Archive } from '@common/types'
/* Utils */
import { gqlRequest } from '@app/_lib/utils/redis'
import { COLLECTION } from '@common/constants'

export const getTagCloud = async (): Promise<T_Archive[]> => {
    return await gqlRequest(
        async () =>
            await client
                .query<{ tagCloud: T_Archive[] }>({
                    query,
                    fetchPolicy: IS_DEV ? 'network-only' : 'cache-first',
                })
                .then((result) => {
                    if (!result.data) {
                        return []
                    }
                    return result.data.tagCloud
                })
                .catch((e) => {
                    Logger.error(`Error fetching tagCloud ${JSON.stringify(e)}`)
                    return []
                }),
        `${COLLECTION.ARCHIVE}-tagCloud`,
    )
}
