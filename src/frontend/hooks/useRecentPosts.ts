import { useQuery } from '@apollo/client'
import { RecentReturnType, GraphQuery } from 'src/constants/graphql'

export const useRecentPosts = () => {
    const { data } = useQuery<RecentReturnType>(GraphQuery.RECENT)
    const recentPost = (data && data.recent) || []

    return { recentPost }
}
