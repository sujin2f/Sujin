import { useQuery as reactUseQuery } from '@tanstack/react-query'
import { IOperation, OperationArgs } from 'src/common/graphql'

type ReturnType<T> = {
    data: T
    loading: boolean
    error: boolean
}

export const useQuery = <T>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    operation: IOperation<any>,
    args: OperationArgs,
): ReturnType<T> => {
    const { data, isLoading, error } = reactUseQuery({
        queryKey: [operation.query.name],
        queryFn: () =>
            fetch('/graphql', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: operation.toString(args) }),
            })
                .then((response) => {
                    if (response.status >= 400) {
                        throw new Error('Error fetching data')
                    }
                    return response.json()
                })
                .then((data) => data.data[operation.query.name]),
    })

    return { data, loading: isLoading, error: !!error }
}
