'use server'
/* Models */
import { Cached } from '@common/model/Cached'
import { Logger } from '@common/model/Logger'
/* Constants */
import { STATIC_FLICKR } from '@src/constants/flickr'
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
import { IS_DEV } from '@common/constants/helper'
/* Types */
import type { FlickrImage, FlickrResponse } from '@src/types/flickr'

export const request = async (): Promise<FlickrImage[]> => {
    const defaultValue = STATIC_FLICKR.items.map((item) => ({
        ...item,
        media: item.media.m,
    }))

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
            next: { revalidate: WEEK_IN_SECONDS },
        },
    )
        .then(async (response) => {
            if (response.status >= 400) {
                throw Error(`Failed to request Flickr with ${id}`)
            }
            const json = (await response.json()) as FlickrResponse
            return json.items.map((item) => ({
                ...item,
                media: item.media.m,
            }))
        })
        .catch((e: Error) => {
            if (e instanceof Error) {
                Logger.server(e.message)
            }
            return defaultValue
        })
}

export const getFlickr = async () =>
    await Cached.getInstance().getOrExecute(
        'flickr',
        async () => await request(),
        WEEK_IN_SECONDS,
    )
