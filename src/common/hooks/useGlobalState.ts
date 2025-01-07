import { GlobalState } from '../model/GlobalState'
import { useEffect, useState } from 'react'
import { Fn } from '../types'

/**
 * Hook for Global State
 * @example
 * const [state, changeState] = useGlobalState('key', 'initial value')
 * if (state === 'initial value') {
 *     // Do something
 *     changeState('changed value')
 * }
 */
export const useGlobalState = <T>(
    key: string,
    defaultValue: T,
): [T, Fn<[T]>] => {
    const globalState = GlobalState.getInstance(
        key,
        defaultValue,
    ) as GlobalState<T>
    const [, setState] = useState<T>(globalState.value)
    const state = globalState.value

    const render = (newState: T) => {
        // This will be called when the global state changes
        setState(newState)
    }

    useEffect(() => {
        // Subscribe to a global state when a component mounts
        globalState.subscribe(render)

        return () => {
            // Unsubscribe from a global state when a component unmounts
            globalState.unsubscribe(render)
        }
    })

    const changeState = (newState: T) => {
        globalState.value = newState
    }

    return [state, changeState]
}
