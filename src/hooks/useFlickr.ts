import { useQuery } from '@common/graphql/useQuery'
import { flickrOpr, queryFlickr } from '@src/constants/graphql'

export const useFlickr = () => {
    const { data, loading, error } = useQuery(queryFlickr, flickrOpr)
    return {
        flickr: data || [],
        loading,
        error,
    }
}
