'use server'
/* Models */
import { client } from '@lib/utils/apollo-client'
import { Logger } from '@sujin/share/model/Logger'
/* CONSTANTS */
import query from '@app/@footer/_lib/getTagCloud.graphql'
import { IS_DEV } from '@sujin/share/constants/helper'
/* T_Types */
import type { T_Archive } from '@sujin/lib/types'
/* Utils */
import { gqlRequest } from '@app/_lib/redis'
import { COLLECTION } from '@sujin/lib/constants'

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
                    Logger.error(`🤬 Error fetching tagCloud ${JSON.stringify(e)}`)
                    return []
                }),
        `${COLLECTION.ARCHIVE}-tagCloud`,
    )
}
