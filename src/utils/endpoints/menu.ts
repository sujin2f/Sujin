import { MenuItem } from 'src/types/wordpress'
import { getMenu } from 'src/utils/mysql/menu'
import { Cached } from 'src/common/model/Cached'

export const menu = async (slug: string): Promise<MenuItem[]> => {
    const cacheKey = `menu ${slug}`
    const cache = Cached.getInstance()
    return await cache.getOrExecute<MenuItem[]>(cacheKey, async () => {
        return await getMenu(slug)
    })
}
