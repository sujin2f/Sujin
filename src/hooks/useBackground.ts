import { useQuery } from '@common/graphql/useQuery'
import { imageOpr, queryBackground } from '@src/constants/graphql'

export const useBackground = () => {
    const { data, loading, error } = useQuery(queryBackground, imageOpr)
    return {
        background: data,
        loading,
        error,
    }
}
