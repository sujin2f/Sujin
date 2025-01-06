import { Cached } from 'src/utils/cached'
import { FlickrImage } from 'src/types/flickr'
import { getFlickr } from 'src/utils/request/flickr'
import { GetOperationArgsType } from 'src/common/graphql'
import { operationFlickr } from 'src/constants/graphql'
import { DAY_IN_SECONDS } from 'src/common/constants/datetime'

export const flickr = async ({
    id,
}: GetOperationArgsType<typeof operationFlickr>): Promise<FlickrImage[]> => {
    return []
    const cacheKey = `flickr`
    const cache = Cached.getInstance()
    return await cache.getOrExecute<FlickrImage[]>(
        cacheKey,
        async () => {
            return await getFlickr(id)
        },
        DAY_IN_SECONDS,
        true,
    )
}
