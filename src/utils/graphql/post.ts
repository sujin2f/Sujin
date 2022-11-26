import { PostVariables } from 'src/constants/graphql'
import { Post } from 'src/types/wordpress'
import { getPost } from 'src/utils/mysql/posts'
import { updateHit } from 'src/utils/mysql/tag-cloud'

export const post = async ({ slug }: PostVariables): Promise<Post> => {
    const post = await getPost('slug', slug)
    if (post) {
        post.tags.forEach((tag) => {
            void updateHit(tag.id)
        })
        return post
    }
    console.error(`🤬 Post does not exist: ${slug}`)
    throw new Error(`🤬 Post does not exist: ${slug}`)
}
