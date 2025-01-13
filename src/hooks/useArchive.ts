import { useQuery } from '@common/graphql/useQuery'
import { archiveOpr, queryArchive } from '@src/constants/graphql'
import { TermTypes } from '@src/types/wordpress'

export const useArchive = (type: TermTypes, slug: string, page: number) => {
    const { data, loading, error } = useQuery(
        queryArchive,
        archiveOpr,
        type,
        slug,
        page,
    )
    return {
        archive: data,
        loading,
        error,
    }
}
