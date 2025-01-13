import { useQuery } from '@common/graphql/useQuery'
import { postOpr, queryPost } from '@src/constants/graphql'

export const usePost = (slug: string) => {
    const { data, loading, error } = useQuery(queryPost, postOpr, slug)
    return {
        post: data,
        loading,
        error,
    }
}
