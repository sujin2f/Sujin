// 'use client'
// import { useRef, useState } from 'react'
// import type { RefObject } from 'react'
// /* T_Types */
// import type { IQuery, ScalarJSType } from '../data/graphql'
// import type { Nullable } from '../types'
// /* Utils */
// import useIntersectionObserver from './useIntersectionObserver'
// import { fetchGQL } from '../data/graphql/fetchGQL'

// /**
//  * Hook that observes an element and calls a callback when it becomes visible.
//  * It fetches data from a GraphQL query and sets the result in the state.
//  * @template A - The type of the DQL arguments.
//  * @template T - The type of the data.
//  * @param {IQuery<A, T[]>} query - The GQL query to fetch data.
//  * @param {string} fields - The fields to fetch from the query.
//  * @param {number} ttl - The time to live of the fetched data.
//  * @param {...A} args - The arguments to pass to the query.
//  * @returns {[RefObject<HTMLElement | null>, Nullable<T[]>]} The reference to the element and the fetched data.
//  */
// const useIntersectionGQL = <A extends ScalarJSType[], T>(
//     query: IQuery<A, T[]>,
//     fields: string,
//     ttl: number,
//     ...args: A
// ): [RefObject<HTMLElement | null>, Nullable<T[]>] => {
//     const ref = useRef<HTMLElement>(null)
//     const [result, setResult] = useState<Nullable<T[]>>()
//     useIntersectionObserver(ref, () => {
//         fetchGQL(query, fields, ttl, ...args)
//             .then((result) => setResult(result))
//             .catch(() => setResult([]))
//     })
//     return [ref, result]
// }

// export default useIntersectionGQL
