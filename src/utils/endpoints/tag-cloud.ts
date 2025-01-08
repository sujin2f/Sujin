import { TagCloud } from '@project/types/wordpress'
import { getTagCloud } from '@utils/mysql/tag-cloud'
import { Cached } from '@common/model/Cached'

export const tagCloud = async () => {
    const cacheKey = `tagCloud`
    const cache = Cached.getInstance()
    return await cache.getOrExecute<TagCloud[]>(cacheKey, async () => {
        return await getTagCloud()
    })
}
