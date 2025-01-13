'use client'

import React, { createContext, PropsWithChildren, useReducer } from 'react'
import type { State } from '@src/store/type'
import { initialState } from '@src/store/constants'
import { reducer } from '@src/store/reducer'

export const Context = createContext([initialState, null])
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ContextType = [State, any]

export function Store({ children }: PropsWithChildren): React.ReactElement {
    const [state, dispatch] = useReducer(reducer, initialState)

    return (
        <Context.Provider value={[state, dispatch] as ContextType}>
            {children}
        </Context.Provider>
    )
}

export const useContext = () => React.useContext(Context) as ContextType
