import { useQuery } from '@apollo/client'
import {
    GraphQuery,
    MenuReturnType,
    MenuVariables,
} from 'src/constants/graphql'

export const useMenu = (slug: string) => {
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
