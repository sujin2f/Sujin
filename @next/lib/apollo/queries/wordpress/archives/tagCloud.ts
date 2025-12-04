'use server'
/* Models */
import { client } from '@lib/utils/apollo-client'
/* CONSTANTS */
import QUERY from '@lib/apollo/queries/wordpress/archives/tagCloud.graphql'
import { IS_DEV } from '@sujin/share/constants/helper'
/* T_Types */
import type { T_Archive } from '@sujin/lib/types'
import { Logger } from '@sujin/share/model/Logger'

export const tagCloud = async (): Promise<T_Archive[]> => {
    return await client
        .query<{ tagCloud: T_Archive[] }>({
            query: QUERY,
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
        })
}
