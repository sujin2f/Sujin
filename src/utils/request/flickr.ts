import axios from 'axios'
import { flickr } from '@src/constants/flickr-default'
import { FlickrImage, FlickrResponse } from '@src/types/flickr'

export const getFlickr = async (id: string): Promise<FlickrImage[]> => {
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
            console.log(e)
            return flickr.items.map((item) => ({
                ...item,
                media: item.media.m,
            }))
        })
    return flickrs
}
