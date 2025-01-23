'use server'

import { flickr } from '@src/constants/flickr-default'
import { FlickrImage, FlickrResponse } from '@src/types/flickr'
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
import { Error as CustomError, isCustomError } from '@common/model/Error'

export const request = async (): Promise<FlickrImage[]> => {
    if (process.env.NODE_ENV === 'development') {
        return flickr.items.map((item) => ({
            ...item,
            media: item.media.m,
        }))
    }

    const id = process.env.FLICKR_ID
    if (!id) {
        return flickr.items.map((item) => ({
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
                throw new CustomError(`Failed to request Flickr with ${id}`)
            }
            const json = (await response.json()) as FlickrResponse
            return json.items.map((item) => ({
                ...item,
                media: item.media.m,
            }))
        })
        .catch((e: Error) => {
            if (isCustomError(e)) {
                e.echo('log')
            }
            if (e instanceof Error) {
                new CustomError(e.message, { level: 'log' })
            }
            return flickr.items.map((item) => ({
                ...item,
                media: item.media.m,
            }))
        })
}
