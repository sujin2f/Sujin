import { TagCloud } from 'src/types/wordpress'
import { getTagCloud } from 'src/utils/mysql/tag-cloud'
import { Cached } from 'src/utils/cached'

export const tagCloud = async () => {
    const cacheKey = `tagCloud`
    const cache = Cached.getInstance()
    return await cache.getOrExecute<TagCloud[]>(cacheKey, async () => {
        return await getTagCloud()
    })
}
