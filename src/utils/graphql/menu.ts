import { MenuVariables } from 'src/constants/graphql'
import { MenuItem } from 'src/types'
import { getMenu } from 'src/utils/mysql/get-menu'

export const menu = async ({ slug }: MenuVariables): Promise<MenuItem[]> => {
    return await getMenu(slug)
}
