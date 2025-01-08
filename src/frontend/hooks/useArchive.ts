import { useQuery } from '@common/graphql/useQuery'
import { operationArchive } from '@constants/graphql'
import { GetOperationArgsType } from '@common/graphql'
import { Term } from '@project/types/wordpress'

export const useArchive = (
    args: GetOperationArgsType<typeof operationArchive>,
) => {
    const { data, loading, error } = useQuery<Term>(operationArchive, args)
    return { archive: data, loading, error }
}
