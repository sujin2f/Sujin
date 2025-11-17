/* Models */
import Logger from '@src/utils/logger'
/* CONSTANTS */
import { DAY_IN_SECONDS } from '@sujin/share/constants/datetime'
import { IS_DEV } from '@sujin/share/constants/helper'
import { STATIC_FLICKR } from '@src/constants'
import { COLLECTION } from '@sujin/lib/constants'
/* T_Types */
import type { T_FlickrImage, T_FlickrResponse } from '@sujin/lib/types'
/* Utils */
import { cachedRequest, getCacheKey } from '@sujin/lib/utils/cache'

const defaultValue = STATIC_FLICKR.items.map((item) => ({
    ...item,
    media: item.media.m,
}))

const request = async (): Promise<T_FlickrImage[]> => {
    if (IS_DEV) {
        return defaultValue
    }

    const id = process.env.FLICKR_ID
    if (!id) {
        return STATIC_FLICKR.items.map((item) => ({
            ...item,
            media: item.media.m,
        }))
    }

    return await fetch(
        `https://www.flickr.com/services/feeds/photos_public.gne?id=${id}&format=json&nojsoncallback=1`,
        {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            cache: 'force-cache',
        },
    )
        .then(async (response) => {
            if (response.status >= 400) {
                Logger.error(`⛈️ Failed to request Flickr with ${id}`)
                throw Error(`Failed to request Flickr with ${id}`)
            }
            const json = (await response.json()) as T_FlickrResponse
            return json.items.map((item) => ({
                ...item,
                media: item.media.m,
            }))
        })
        .catch((e: Error) => {
            if (e instanceof Error) {
                Logger.error(
                    `⛈️ Fetching from Flickr has been failed: ${e.message}`,
                )
            }
            return defaultValue
        })
}

export const flickr = async (): Promise<T_FlickrImage[]> => {
    const cached = cachedRequest(
        request,
        getCacheKey(COLLECTION.ARCHIVE, 'tag-cloud'),
        {
            ttl: DAY_IN_SECONDS * 30,
        },
    )

    const result = await cached()
    Logger.info('🤟 flickr query has been finished')
    return result
}
