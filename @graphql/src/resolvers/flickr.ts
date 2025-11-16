/* Models */
import Cached from '@sujin/node-cache'
import Logger from '@src/utils/logger'
/* CONSTANTS */
import { WEEK_IN_SECONDS } from '@sujin/share/constants/datetime'
import { IS_DEV } from '@sujin/share/constants/helper'
import { STATIC_FLICKR } from '@src/constants'
/* T_Types */
import type { T_FlickrImage, T_FlickrResponse } from '@sujin/lib/types'

const defaultValue = STATIC_FLICKR.items.map((item) => ({
    ...item,
    media: item.media.m,
}))

export const request = async (): Promise<T_FlickrImage[]> => {
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

export const flickr = async () => {
    const result = await Cached.getInstance().getOrExecute(
        'flickr',
        request(),
        {
            ttl: WEEK_IN_SECONDS,
        },
    )
    Logger.info('🤟 flickr query has been finished')
    return result
}
