'use server'
/* Models */
import { client } from '@lib/utils/apollo-client'
import { Logger } from '@sujin/share/model/Logger'
/* CONSTANTS */
import query from '@app/@footer/_lib/getFlickr-gql.graphql'
import { IS_DEV } from '@sujin/share/constants/helper'
/* T_Types */
import type { T_FlickrImage } from '@sujin/lib/types'
/* Utils */
import { gqlRequest } from '@app/_lib/utils/redis'

export const getFlickr = async (): Promise<T_FlickrImage[]> => {
    return await gqlRequest(
        async () =>
            await client
                .query<{ flickr: T_FlickrImage[] }>({
                    query,
                    fetchPolicy: IS_DEV ? 'network-only' : 'cache-first',
                })
                .then((result) => {
                    if (!result.data) {
                        return []
                    }
                    return result.data.flickr
                })
                .catch((e) => {
                    Logger.error(`🤬 Error fetching flickr ${JSON.stringify(e)}`)
                    return []
                }),
        `flickr`,
    )
}
