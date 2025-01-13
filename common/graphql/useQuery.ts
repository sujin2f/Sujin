import { useQuery as reactUseQuery } from '@tanstack/react-query'
import { useGlobalState } from '../hooks/useGlobalState'
import type { IQuery, ScalarJSType } from '.'
import type { Nullable } from '../types'
import { Error } from '@common/model/Error'

type ReturnType<T> = {
    data: Nullable<T>
    loading: boolean
    error: boolean
}

export const useQuery = <A extends ScalarJSType[], R>(
    query: IQuery<A, R>,
    fields: string,
    ...args: A
): ReturnType<R> => {
    // Cache with GlobalState
    const key = [query.name, ...args].join(',')
    const [[stateData, enabled], changeState] = useGlobalState(key, [
        undefined,
        true,
    ])

    const { data, isLoading, error } = reactUseQuery<Nullable<R>>({
        queryKey: [query.name, ...args],
        queryFn: () =>
            fetch(`/api/graphql`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: query.toOperation(fields, ...args),
                }),
            })
                .then((response) => {
                    if (response.status >= 400) {
                        throw new Error(
                            `GraphQL query failed for query ${query.name} and ${args}`,
                            { level: 'log' },
                        )
                    }
                    return response.json()
                })
                .then((data) => {
                    const value = data.data[query.name]
                    if (!value) {
                        throw new Error(
                            `GraphQL query failed for query ${query.name} and ${args}`,
                            { level: 'log' },
                        )
                    }
                    changeState([value, false])
                    return value
                }),
        enabled,
    })

    return { data: stateData || data, loading: isLoading, error: !!error }
}
