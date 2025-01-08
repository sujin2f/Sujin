/** store */
import React, { createContext, PropsWithChildren, useReducer } from 'react'
import { reducer } from '@frontend/store/reducer'
import type { State } from '@frontend/store/type'
import { initialState } from '@frontend/store/constants'

export const Context = createContext([initialState, null])
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ContextType = [State, any]

export function Store({ children }: PropsWithChildren): React.ReactElement {
    const [state, dispatch]: ContextType = useReducer(reducer, initialState)
    return (
        <Context.Provider value={[state, dispatch]}>
            {children}
        </Context.Provider>
    )
}
