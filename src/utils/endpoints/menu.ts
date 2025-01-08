import { MenuItem } from 'src/types/wordpress'
import { getMenu } from 'src/utils/mysql/menu'
import { Cached } from 'src/common/model/Cached'
import { GetOperationArgsType } from 'src/common/graphql'
import { operationMenu } from 'src/constants/graphql'

export const menu = async ({
    slug,
}: GetOperationArgsType<typeof operationMenu>): Promise<MenuItem[]> => {
    const cacheKey = `menu ${slug}`
    const cache = Cached.getInstance()
    return await cache.getOrExecute<MenuItem[]>(cacheKey, async () => {
        return await getMenu(slug)
    })
}
