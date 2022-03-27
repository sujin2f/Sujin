import { useQuery } from '@apollo/client'
import { GraphQuery, FlickrReturnType } from 'src/constants/graphql'

export const useFlickr = () => {
    const { data } = useQuery<FlickrReturnType>(GraphQuery.FLICKR)
    const flickr = (data && data.flickr) || []
    return { flickr }
}
