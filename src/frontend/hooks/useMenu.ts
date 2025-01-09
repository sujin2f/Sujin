import { useQuery } from 'src/common/graphql/useQuery'
import { operationMenu } from 'src/constants/graphql'
import { MenuItem } from 'src/types/wordpress'
import { PROJECT } from 'src/constants/menu-static'
import { GetOperationArgsType } from 'src/common/graphql'

export const useMenu = (args: GetOperationArgsType<typeof operationMenu>) => {
    const { data, loading, error } = useQuery<MenuItem[]>(operationMenu, args)

    return {
        menu: data ? ([...data, PROJECT] as MenuItem[]) : [],
        loading,
        error,
    }
}
