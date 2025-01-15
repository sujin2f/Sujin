import { useQuery } from '@common/graphql/useQuery'
import { menuOpr, queryMenu } from '@src/constants/graphql'
import { MenuEther } from '@src/constants/menu'
import { MenuNames } from '@src/constants/mysql-query'

export const useMenu = (id: string) => {
    const { data, loading, error } = useQuery(queryMenu, menuOpr, id)
    const menu = id === MenuNames.ETHER ? MenuEther : data || []
    return {
        menu,
        loading,
        error,
    }
}
