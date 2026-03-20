/* Models */
import { Logger } from '@common/model/Logger'
/* CONSTANTS */
import { IS_DEV } from '@common/constants/helper'
import { STATIC_FLICKR } from '@src/constants'
import { DAY_IN_SECONDS } from '@common/constants/datetime'
/* Utils */
import { setCache } from '@src/utils/redis/cache'
/* T_Types */
import type { T_FlickrImage, T_FlickrResponse } from '@common/types'

/**
 * Default set of Flickr items used when the environment is in dev mode or
 * when a request to Flickr fails.
 */
const defaultValue = STATIC_FLICKR.items.map((item) => ({
    ...item,
    media: item.media.m,
}))

/**
 * Internal request to Flickr public feeds. Returns an array of simplified
 * `T_FlickrImage` objects with `media` normalized to `media.m`.
 *
 * @returns {Promise<T_FlickrImage[]>} Promise resolving to an array of `T_FlickrImage`.
 */
const requestFlickrImages = async (): Promise<T_FlickrImage[]> => {
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
                Logger.error(`⛈️ Fetching from Flickr has been failed: ${e.message}`)
            }
            return defaultValue
        })
}

/**
 * Public resolver used by GraphQL. Uses a cached request wrapper and logs
 * completion. Returns a list of Flickr images.
 *
 * @returns {Promise<T_FlickrImage[]>} Promise resolving to `T_FlickrImage[]`.
 */
export const flickr = async (): Promise<T_FlickrImage[]> => {
    const result = await requestFlickrImages()
    setCache(JSON.stringify(result), 'flickr', 30 * DAY_IN_SECONDS)
    Logger.info('⭐️ flickr query has been finished')
    return result
}
