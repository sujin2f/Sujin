import { Cached } from '@common/model/Cached'
import { FlickrImage } from '@project/types/flickr'
import { getFlickr } from '@utils/request/flickr'
import { GetOperationArgsType } from '@common/graphql'
import { operationFlickr } from '@constants/graphql'

export const flickr = async ({
    id,
}: GetOperationArgsType<typeof operationFlickr>): Promise<FlickrImage[]> => {
    const cacheKey = `flickr`
    const cache = Cached.getInstance()
    return await cache.getOrExecute<FlickrImage[]>(cacheKey, async () => {
        return await getFlickr(id)
    })
}
