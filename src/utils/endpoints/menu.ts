import { MenuItem } from '@project/types/wordpress'
import { getMenu } from '@utils/mysql/menu'
import { Cached } from '@common/model/Cached'
import { GetOperationArgsType } from '@common/graphql'
import { operationMenu } from '@constants/graphql'

export const menu = async ({
    slug,
}: GetOperationArgsType<typeof operationMenu>): Promise<MenuItem[]> => {
    const cacheKey = `menu ${slug}`
    const cache = Cached.getInstance()
    return await cache.getOrExecute<MenuItem[]>(cacheKey, async () => {
        return await getMenu(slug)
    })
}
