import { useQuery } from '@common/graphql/useQuery'
import { operationMenu } from '@constants/graphql'
import { MenuItem } from '@project/types/wordpress'
import { DEV_TOOL } from '@constants/menu-devtool'
import { GetOperationArgsType } from '@common/graphql'

export const useMenu = (args: GetOperationArgsType<typeof operationMenu>) => {
    const { data, loading, error } = useQuery<MenuItem[]>(operationMenu, args)

    return {
        menu: data ? ([...data, DEV_TOOL] as MenuItem[]) : [],
        loading,
        error,
    }
}
