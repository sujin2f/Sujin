import axios from 'axios'
import { FlickrImage, FlickrResponse } from 'src/types/flickr'

export const getFlickr = async (): Promise<FlickrImage[]> => {
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
        .catch(() => [])

    return flickrs
}
