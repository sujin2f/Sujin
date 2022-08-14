/** store */
import React, { createContext, PropsWithChildren, useReducer } from 'react'
import { reducer, initialState } from 'src/frontend/store/reducer'
import { State } from 'src/types/store'

export const Context = createContext([initialState, null])
export type ContextType = [State, any]

export const Store = ({
    children,
}: PropsWithChildren<{}>): React.ReactElement => {
    const [state, dispatch]: ContextType = useReducer(reducer, initialState)
    return (
        <Context.Provider value={[state, dispatch]}>
            {children}
        </Context.Provider>
    )
}
