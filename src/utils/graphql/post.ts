import { PostVariables } from 'src/constants/graphql'
import { Post } from 'src/types/wordpress'
import { getPost } from 'src/utils/mysql/posts'

export const post = async ({ slug }: PostVariables): Promise<Post> => {
    const post = await getPost(slug)
    if (post) {
        return post
    }
    console.error(`🤬 Post does not exist: ${slug}`)
    throw new Error(`🤬 Post does not exist: ${slug}`)
}
