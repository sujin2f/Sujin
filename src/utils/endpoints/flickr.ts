import { Cached } from 'src/utils/cached'
import { FlickrImage } from 'src/types/flickr'
import { getFlickr } from 'src/utils/request/flickr'

export const flickr = async (): Promise<FlickrImage[]> => {
    const cacheKey = `flickr`
    const cache = Cached.getInstance()
    return await cache.getOrExecute<FlickrImage[]>(cacheKey, async () => {
        return await getFlickr()
    })
}
