import { RootState } from '@app/_store'
import { RefObject, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useServerAction } from './useServerAction'
import useIntersectionObserver from '@common/hooks/useIntersectionObserver'
import { ActionCreatorWithPayload } from '@reduxjs/toolkit'
import { Nullable } from '@sujin/share/types'

type ReturnType<T> = {
    ref: RefObject<null>
    data: Nullable<T>
    loading: boolean
    error: boolean
}

export const useStoreOrAction = <T>(
    state: keyof RootState,
    action: () => Promise<T>,
    setStore: ActionCreatorWithPayload<T>,
): ReturnType<T> => {
    // Redux store
    const fromState = useSelector((rootState: RootState) => rootState[state] as T)
    const dispatch = useDispatch()

    // Read from GraphQL with Intersection Observer & update store
    const ref = useRef(null)
    const [skip, setSkip] = useState(true)
    // Read from GraphQL
    const { loading, error, data } = useServerAction(action, skip || (Array.isArray(fromState) && fromState.length > 0))

    useEffect(() => {
        if (Array.isArray(fromState) && fromState.length === 0 && data && Array.isArray(data) && data.length) {
            dispatch(setStore(data))
        }
    }, [data, dispatch, fromState, setStore])
    useIntersectionObserver(ref, async () => {
        setSkip(false)
    })

    return { ref, data: fromState || data, loading, error }
}
