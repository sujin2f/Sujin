import { useQuery as reactUseQuery } from '@tanstack/react-query'
import { useGlobalState } from '../hooks/useGlobalState'
import type { IOperation, OperationArgs } from '.'
import type { Nullable } from '../types'

type ReturnType<T> = {
    data: Nullable<T>
    loading: boolean
    error: boolean
}

export const useQuery = <T>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    operation: IOperation<any>,
    args: OperationArgs,
): ReturnType<T> => {
    // Cache with GlobalState
    const key = [operation.query.name, ...Object.values(args)].join(',')
    const [[stateData, enabled], changeState] = useGlobalState(key, [
        undefined,
        true,
    ])

    const { data, isLoading, error } = reactUseQuery<Nullable<T>>({
        queryKey: [operation.query.name, ...Object.values(args)],
        queryFn: () =>
            fetch('/graphql', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: operation.toString(args),
                }),
            })
                .then((response) => {
                    if (response.status >= 400) {
                        throw new Error('Error fetching data')
                    }
                    return response.json()
                })
                .then((data) => {
                    const value = data.data[operation.query.name]
                    changeState([value, false])
                    return value
                }),
        enabled,
    })

    return { data: stateData || data, loading: isLoading, error: !!error }
}
