import { useQuery as reactUseQuery } from '@tanstack/react-query'
import { useGlobalState } from '../hooks/useGlobalState'
import type { IQuery, ScalarJSType } from '.'
import type { Nullable } from '../types'
import { fetchGQL } from './fetchGQL'

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
    const [[stateData, enabled], changeState] = useGlobalState<
        [Nullable<R>, boolean]
    >(key, [undefined, true])

    const { data, isLoading, error } = reactUseQuery<Nullable<R>>({
        queryKey: [query.name, ...args],
        queryFn: () =>
            fetchGQL(query, fields, ...args).then((value) => {
                changeState([value, false])
                return value
            }),
        enabled,
    })

    return { data: stateData || data, loading: isLoading, error: !!error }
}
