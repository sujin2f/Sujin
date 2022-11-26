import { MenuVariables } from 'src/constants/graphql'
import { MenuItem } from 'src/types/wordpress'
import { getMenu } from 'src/utils/mysql/menu'

export const menu = async ({ slug }: MenuVariables): Promise<MenuItem[]> => {
    return await getMenu(slug)
}
