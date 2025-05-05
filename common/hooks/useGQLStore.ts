'use client'
import { useContext, useEffect, useState } from 'react'
import type { ActionDispatch, Context } from 'react'
/* T_Types */
import type { IQuery, ScalarJSType } from '../data/graphql'
/* Utils */
import { fetchGQL } from '../data/graphql/fetchGQL'

enum Status {
    'INIT',
    'PENDING',
    'ERROR',
    'DONE',
}
/**
 * Hook that observes an element and calls a callback when it becomes visible.
 * It fetches data from a GraphQL query and sets the result in the global state.
 * @see /components/Store.tsx
 *
 * @template Key - The key of context data node
 * @template CnTxt - Context data set
 * @template Args - The type of the GQL arguments.
 * @template T - The type of the data.
 *
 * @param {Key} key - The key of context data node
 * @param {Context<[CnTxt, ActionDispatch<[action: [string, unknown]]>]>} context - context from createContext
 * @param {IQuery<Args, T[]>} query - The GQL query to fetch data.
 * @param {string} fields - The fields to fetch from the query.
 * @param {number} ttl - The time to live of the fetched data.
 * @param {...A} args - The arguments to pass to the query.
 * @returns {[RefObject<HTMLElement | null>, Nullable<T[]>]} The reference to the element and the fetched data.
 */
const useGQLStore = <
    Key extends string,
    CnTxt extends Record<string, unknown> & { [key in Key]: T[] },
    Args extends ScalarJSType[],
    T,
>(
    key: Key,
    context: Context<[CnTxt, ActionDispatch<[action: [string, unknown]]>]>,
    query: IQuery<Args, T[]>,
    fields: string,
    ttl: number,
    ...args: Args
): {
    items: T[]
    pending: boolean
    error: boolean
} => {
    const [value, dispatch] = useContext(context)
    const initial = value[key].length ? Status.DONE : Status.INIT
    const [status, setStatus] = useState<Status>(initial)

    useEffect(() => {
        if (status === Status.INIT) {
            setStatus(Status.PENDING)
            fetchGQL(query, fields, ttl, ...args)
                .then((result) => {
                    dispatch([key, result])
                    setStatus(Status.DONE)
                })
                .catch(() => setStatus(Status.ERROR))
        }
    }, [args, dispatch, fields, key, query, status, ttl])

    const pending =
        (!value[key].length && status === Status.PENDING) ||
        status === Status.INIT
    const error = !value[key].length && status === Status.ERROR

    return { items: value[key], pending, error }
}

export default useGQLStore
