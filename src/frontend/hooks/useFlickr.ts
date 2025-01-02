import { useQuery } from '@apollo/client'
import {
    GraphQuery,
    FlickrReturnType,
    FlickrVariables,
} from 'src/constants/graphql'

export const useFlickr = () => {
    const { data } = useQuery<FlickrReturnType, FlickrVariables>(
        GraphQuery.FLICKR,
        {
            variables: {
                id: window.globalVariable.flickrId,
            },
        },
    )
    const flickr = (data && data.flickr) || []
    return { flickr }
}
