'use client'
import { type RefObject, useRef, useState } from 'react'
/* Types */
import type { IQuery, ScalarJSType } from '../data/graphql'
import type { Nullable } from '../types'
/* Utils */
import useIntersectionObserver from './useIntersectionObserver'
import { fetchGQL } from '../data/graphql/fetchGQL'

/**
 * Hook that observes an element and calls a callback when it becomes visible.
 * @param {RefObject<HTMLElement | null>} ref - The reference to the element to observe.
 * @param {() => void} callback - The callback to call when the element becomes visible.
 * @returns {void}
 */
const useIntersectionGQL = <A extends ScalarJSType[], T>(
    query: IQuery<A, T[]>,
    fields: string,
    ttl: number,
    ...args: A
): [RefObject<HTMLElement | null>, Nullable<T[]>] => {
    const ref = useRef<HTMLElement>(null)
    const [result, setTagCloud] = useState<Nullable<T[]>>()
    useIntersectionObserver(ref, () => {
        fetchGQL(query, fields, ttl, ...args)
            .then((result) => setTagCloud(result))
            .catch(() => setTagCloud([]))
    })
    return [ref, result]
}

export default useIntersectionGQL
