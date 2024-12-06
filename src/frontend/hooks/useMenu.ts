import { ApolloError, useQuery } from '@apollo/client'
import {
    GraphQuery,
    MenuReturnType,
    MenuVariables,
} from 'src/constants/graphql'
import { MenuItem } from 'src/types/wordpress'
import { DEV_TOOL } from '../../constants/menu-devtool'

export const useMenu = (
    slug: string,
): { menu: MenuItem[]; loading: boolean; error: ApolloError | undefined } => {
    if (slug === 'devtool') {
        return {
            menu: [DEV_TOOL],
            loading: false,
            error: undefined,
        }
    }
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data, loading, error } = useQuery<MenuReturnType, MenuVariables>(
        GraphQuery.MENU,
        {
            variables: { slug },
            skip: !slug,
        },
    )
    const menu = (data && data.menu) || []

    return {
        menu: slug === 'main' ? [...menu, DEV_TOOL] : menu,
        loading,
        error,
    }
}
