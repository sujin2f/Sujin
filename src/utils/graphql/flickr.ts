import axios from 'axios'
import { cached } from 'src/utils'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { FlickrImage, FlickrResponse } from 'src/types'

export const flickr = async (): Promise<FlickrImage[]> => {
    const cache = cached.get<FlickrImage[]>('flickr')
    if (cache) {
        return cache
    }

    if (!process.env.FLICKR_ID) {
        return []
    }

    const flickrs = await axios
        .get(
            `https://www.flickr.com/services/feeds/photos_public.gne?id=${process.env.FLICKR_ID}&format=json&nojsoncallback=1`,
            { responseType: 'json' },
        )
        .then((response) => {
            const result = response.data as unknown as FlickrResponse
            return result.items.map((item) => ({
                ...item,
                media: item.media.m,
            }))
        })
        .catch(() => {
            throw new Error()
        })

    cached.set<FlickrImage[]>('flickr', flickrs)
    return flickrs
}
