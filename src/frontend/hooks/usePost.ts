import { GetOperationArgsType } from '@common/graphql'
import { useQuery } from '@common/graphql/useQuery'
import { operationPost } from '@constants/graphql'
import { Post } from '@project/types/wordpress'

export const usePost = (args: GetOperationArgsType<typeof operationPost>) => {
    const { data, loading, error } = useQuery<Post>(operationPost, args)
    return { post: data, loading, error }
}
