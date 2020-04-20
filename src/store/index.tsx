/** store */
import React, { createContext, useReducer } from 'react'
import { reducer, initialState, State } from 'store/reducer'

// Dispatch
interface Props {
  children: JSX.Element|JSX.Element[]
}

export const Context = createContext([initialState, null])
export type Context = [State, any]

export const Store = ({ children }: Props) => {
  const [state, dispatch]: Context = useReducer(reducer, initialState)
  return (
    <Context.Provider value={[state, dispatch]}>
      {children}
    </Context.Provider>
  )
}
