import { Cached } from '@src/common/model/Cached'
import { FlickrImage } from '@src/types/flickr'
import { getFlickr } from '@src/utils/request/flickr'
import { GetOperationArgsType } from '@src/common/graphql'
import { operationFlickr } from '@src/constants/graphql'

export const flickr = async ({
    id,
}: GetOperationArgsType<typeof operationFlickr>): Promise<FlickrImage[]> => {
    const cacheKey = `flickr`
    const cache = Cached.getInstance()
    return await cache.getOrExecute<FlickrImage[]>(cacheKey, async () => {
        return await getFlickr(id)
    })
}
