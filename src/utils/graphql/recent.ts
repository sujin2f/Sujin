import { TermTypes } from 'src/types/wordpress'
import { getPostsBy } from '../mysql/posts'

export const recent = async () => {
    return await getPostsBy(TermTypes.recent_posts)
}
