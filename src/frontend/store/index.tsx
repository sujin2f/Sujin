/** store */
import React, { createContext, useReducer } from 'react'
import { reducer, initialState } from 'src/frontend/store/reducer'
import { State } from 'src/types/store'

// Dispatch
interface Props {
    children: JSX.Element | JSX.Element[]
}

export const Context = createContext([initialState, null])
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Context = [State, any]

export const Store = ({ children }: Props): React.ReactElement => {
    const [state, dispatch]: Context = useReducer(reducer, initialState)
    return (
        <Context.Provider value={[state, dispatch]}>
            {children}
        </Context.Provider>
    )
}
