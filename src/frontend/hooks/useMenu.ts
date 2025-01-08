import { useQuery } from '@src/common/graphql/useQuery'
import { operationMenu } from '@src/constants/graphql'
import { MenuItem } from '@src/types/wordpress'
import { DEV_TOOL } from '@src/constants/menu-devtool'
import { GetOperationArgsType } from '@src/common/graphql'

export const useMenu = (args: GetOperationArgsType<typeof operationMenu>) => {
    const { data, loading, error } = useQuery<MenuItem[]>(operationMenu, args)

    return {
        menu: data ? ([...data, DEV_TOOL] as MenuItem[]) : [],
        loading,
        error,
    }
}
