import { useQuery } from 'src/common/graphql/useQuery'
import { operationRecentPost } from 'src/constants/graphql'
import { Post } from 'src/types/wordpress'

export const useRecentPosts = () => {
    const { data } = useQuery<Post[]>(operationRecentPost, {})

    return { recentPost: data || [] }
}
