import { useQuery } from 'src/common/graphql/useQuery'
import { operationFlickr } from 'src/constants/graphql'
import { GetOperationArgsType } from 'src/common/graphql'
import { FlickrImage } from 'src/types/flickr'

export const useFlickr = (
    args: GetOperationArgsType<typeof operationFlickr>,
) => {
    const { data } = useQuery<FlickrImage[]>(operationFlickr, args)

    return {
        flickr: data || [],
    }
}
