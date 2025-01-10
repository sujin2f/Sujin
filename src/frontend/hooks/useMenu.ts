import { useQuery } from 'src/common/graphql/useQuery'
import { MenuItem } from 'src/types/wordpress'
import { PROJECT } from 'src/constants/menu-static'
import { menuOpr, queryMenu } from 'src/constants/graphql'

export const useMenu = (id: string) => {
    const { data, loading, error } = useQuery(queryMenu, menuOpr, id)
    return {
        menu: data ? ([...data, PROJECT] as MenuItem[]) : [],
        loading,
        error,
    }
}
