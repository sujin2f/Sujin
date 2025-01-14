import { useQuery } from '@common/graphql/useQuery'
import { menuOpr, queryMenu } from '@src/constants/graphql'

export const useMenu = (id: string) => {
    const { data, loading, error } = useQuery(queryMenu, menuOpr, id)
    return {
        menu: data || [],
        loading,
        error,
    }
}
