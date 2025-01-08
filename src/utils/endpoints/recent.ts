import { Post, TermTypes } from '@project/types/wordpress'
import { getPostsBy } from '../mysql/posts'
import { Cached } from '@common/model/Cached'

export const recent = async () => {
    const cacheKey = `recent`
    const cache = Cached.getInstance()
    return await cache.getOrExecute<Post[]>(cacheKey, async () => {
        return await getPostsBy(TermTypes.recent_posts)
    })
}
