/** store */
import React, { createContext, PropsWithChildren, useReducer } from 'react'
import { reducer } from '@src/frontend/store/reducer'
import type { State } from '@src/frontend/store/type'
import { initialState } from '@src/frontend/store/constants'

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
