/* Models */
import { Post } from '@src/schema/post'
/* Utils */
import { getPost } from '@src/utils/wordpress/post'

/**
 * Refresh a single post from MySQL.
 *
 * @param slug - Post slug to refresh.
 */
export const updatePost = async (slug: string): Promise<void> => {
    const wpPost = await getPost(slug)
    await Post.findOne({ slug }).then(async (post) => {
        if (post) {
            await Post.updateOne({ slug }, wpPost)
            return
        }

        await Post.insertOne(wpPost)
    })
}
