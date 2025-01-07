import { useQuery } from 'src/common/graphql/useQuery'
import { operationArchive } from 'src/constants/graphql'
import { GetOperationArgsType } from 'src/common/graphql'
import { Term } from 'src/types/wordpress'

export const useArchive = (
    args: GetOperationArgsType<typeof operationArchive>,
) => {
    const { data, loading, error } = useQuery<Term>(operationArchive, args)
    return { archive: data, loading, error }
}
