import { useQuery } from '@common/graphql/useQuery'
import { operationRecentPost } from '@constants/graphql'
import { Post } from '@project/types/wordpress'

export const useRecentPosts = () => {
    const { data } = useQuery<Post[]>(operationRecentPost, {})

    return { recentPost: data || [] }
}
