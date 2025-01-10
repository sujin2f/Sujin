import { Cached } from 'src/common/model/Cached'
import { FlickrImage } from 'src/types/flickr'
import { getFlickr } from 'src/utils/request/flickr'

export const flickr = async (): Promise<FlickrImage[]> => {
    const cacheKey = 'flickr'
    const cache = Cached.getInstance()
    return await cache.getOrExecute<FlickrImage[]>(cacheKey, async () => {
        return await getFlickr(process.env.FLICKR_ID || '')
    })
}
