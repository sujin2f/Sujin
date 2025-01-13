import { useQuery } from '@common/graphql/useQuery'
import { queryTagCloud, tagCloudOpr } from '@src/constants/graphql'

export const useTagCloud = () => {
    const { data, loading, error } = useQuery(queryTagCloud, tagCloudOpr)
    return {
        tagCloud: data || [],
        loading,
        error,
    }
}
