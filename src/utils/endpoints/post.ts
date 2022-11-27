import { PostVariables } from 'src/constants/graphql'
import { Post } from 'src/types/wordpress'
import { getPost } from 'src/utils/mysql/posts'
import { updateHit } from 'src/utils/mysql/tag-cloud'
import { Cached } from 'src/utils/node-cache'

export const post = async ({ slug }: PostVariables): Promise<Post> => {
    const cacheKey = `post ${slug}`
    const cache = Cached.getInstance()
    const post = await cache.getOrExecute<Post>(cacheKey, async () => {
        return await getPost('slug', slug)
    })

    if (!cache.isFailed(post)) {
        post.tags.forEach((tag) => {
            void updateHit(tag.id)
        })
        return post
    }
    console.error(`🤬 Post does not exist: ${slug}`)
    throw new Error(`🤬 Post does not exist: ${slug}`)
}
