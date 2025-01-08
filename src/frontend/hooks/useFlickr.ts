import { useQuery } from '@common/graphql/useQuery'
import { operationFlickr } from '@constants/graphql'
import { GetOperationArgsType } from '@common/graphql'
import { FlickrImage } from '@project/types/flickr'

export const useFlickr = (
    args: GetOperationArgsType<typeof operationFlickr>,
) => {
    const { data } = useQuery<FlickrImage[]>(operationFlickr, args)

    return {
        flickr: data || [],
    }
}
