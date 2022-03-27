import { useQuery } from '@apollo/client'
import { GraphQuery, TagCloudReturnType } from 'src/constants/graphql'

export const useTagCloud = () => {
    const { data } = useQuery<TagCloudReturnType>(GraphQuery.TAG_CLOUD)
    const tagCloud = (data && data.tagCloud) || []
    return { tagCloud }
}
