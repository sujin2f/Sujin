import { TermTypes } from 'src/types/wordpress'
import { getPostsBy } from '../mysql/get-posts-by'

export const recent = async () => {
    return await getPostsBy(TermTypes.recent_posts)
}
