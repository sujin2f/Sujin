import { PostVariables } from 'src/constants/graphql'
import { Post } from 'src/types'
import { getPost } from 'src/utils/mysql/get-posts-by'

export const post = async ({ slug }: PostVariables): Promise<Post> => {
    return await getPost(slug)
}
