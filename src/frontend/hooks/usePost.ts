import { GetOperationArgsType } from 'src/common/graphql'
import { useQuery } from 'src/common/graphql/useQuery'
import { operationPost } from 'src/constants/graphql'
import { Post } from 'src/types/wordpress'

export const usePost = (args: GetOperationArgsType<typeof operationPost>) => {
    const { data, loading, error } = useQuery<Post>(operationPost, args)
    return { post: data, loading, error }
}
