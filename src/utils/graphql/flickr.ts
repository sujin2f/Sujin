import axios from 'axios'
import { cached } from 'src/utils/node-cache'
import { FlickrImage, FlickrResponse } from 'src/types/flickr'

export const flickr = async (): Promise<FlickrImage[]> => {
    const cache = cached.get<FlickrImage[]>('flickr')
    if (cache) {
        return cache
    }

    if (!process.env.FLICKR_ID) {
        return []
    }

    const flickrs = await axios
        .get<FlickrResponse>(
            `https://www.flickr.com/services/feeds/photos_public.gne?id=${process.env.FLICKR_ID}&format=json&nojsoncallback=1`,
            { responseType: 'json' },
        )
        .then((response) => {
            return response.data.items.map((item) => ({
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
