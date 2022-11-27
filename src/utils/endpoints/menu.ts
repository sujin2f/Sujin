import { MenuVariables } from 'src/constants/graphql'
import { MenuItem } from 'src/types/wordpress'
import { getMenu } from 'src/utils/mysql/menu'
import { Cached } from 'src/utils/cached'

export const menu = async ({ slug }: MenuVariables): Promise<MenuItem[]> => {
    const cacheKey = `menu ${slug}`
    const cache = Cached.getInstance()
    return await cache.getOrExecute<MenuItem[]>(cacheKey, async () => {
        return await getMenu(slug)
    })
}
