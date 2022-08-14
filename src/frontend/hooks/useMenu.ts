import { ApolloError, useQuery } from '@apollo/client'
import {
    GraphQuery,
    MenuReturnType,
    MenuVariables,
} from 'src/constants/graphql'
import { MenuItem } from 'src/types/wordpress'

export const useMenu = (
    slug: string,
): { menu: MenuItem[]; loading: boolean; error: ApolloError | undefined } => {
    const { data, loading, error } = useQuery<MenuReturnType, MenuVariables>(
        GraphQuery.MENU,
        {
            variables: { slug },
            skip: !slug,
        },
    )
    const menu = (data && data.menu) || []
    return { menu, loading, error }
}
