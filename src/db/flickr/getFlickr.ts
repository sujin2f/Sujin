'use server'

import { unstable_cache } from 'next/cache'
import axios from 'axios'
import { flickr } from '@src/constants/flickr-default'
import { FlickrImage, FlickrResponse } from '@src/types/flickr'
import { DAY_IN_SECONDS } from '@common/constants/datetime'

const request = async (): Promise<FlickrImage[]> => {
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

    const flickrs = await axios
        .get<FlickrResponse>(
            `https://www.flickr.com/services/feeds/photos_public.gne?id=${id}&format=json&nojsoncallback=1`,
            { responseType: 'json' },
        )
        .then((response) => {
            return response.data.items.map((item) => ({
                ...item,
                media: item.media.m,
            }))
        })
        .catch((e) => {
            console.log(e.message)
            return flickr.items.map((item) => ({
                ...item,
                media: item.media.m,
            }))
        })
    return flickrs
}

export const getFlickr = unstable_cache(
    async (): Promise<FlickrImage[]> => await request(),
    ['flickr'],
    { revalidate: DAY_IN_SECONDS * 7 },
)
