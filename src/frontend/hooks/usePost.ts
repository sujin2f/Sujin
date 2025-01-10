import { useQuery } from 'src/common/graphql/useQuery'
import { postOpr, queryPost } from 'src/constants/graphql'

export const usePost = (id: string) => {
    const { data, loading, error } = useQuery(queryPost, postOpr, id)
    return {
        post: data,
        loading,
        error,
    }
}
