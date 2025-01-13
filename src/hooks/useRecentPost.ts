import { useQuery } from '@common/graphql/useQuery'
import { miniPostOpr, queryRecent } from '@src/constants/graphql'

export const useRecentPost = () => {
    const { data, loading, error } = useQuery(queryRecent, miniPostOpr)
    return {
        recentPost: data || [],
        loading,
        error,
    }
}
