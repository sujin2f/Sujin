'use server'
/* Models */
import { client } from '@lib/utils/apollo-client'
/* CONSTANTS */
import QUERY from '@lib/apollo/queries/misc/flickr.graphql'
import { IS_DEV } from '@sujin/share/constants/helper'
/* T_Types */
import type { T_FlickrImage } from '@sujin/lib/types'
import { Logger } from '@sujin/share/model/Logger'

export const flickr = async (): Promise<T_FlickrImage[]> => {
    return await client
        .query<{ flickr: T_FlickrImage[] }>({
            query: QUERY,
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
        })
}
