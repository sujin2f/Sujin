'use client'
import React, { ActionDispatch, PropsWithChildren, useReducer } from 'react'

/**
 * Get Context.Provider
 * @param Context Use createContext to create
 * @param INITIAL_STATE
 * @example
   const INITIAL_STATE = {
       key: value
   }
   const Context = createContext<
       [typeof INITIAL_STATE, ActionDispatch<[action: [string, unknown]]>]
   >([INITIAL_STATE, () => {}])

   // In your top level component
   <Store Context={Context} INITIAL_STATE={INITIAL_STATE}>
       ...
   </Store>

   // In client component
   const [{ key }, dispatch] = useContext(Context)
   someAction().then((value) => dispatch('key', value))
 */
export const Store = <T extends Record<string, unknown>>({
    children,
    Context,
    INITIAL_STATE,
}: PropsWithChildren<{
    Context: React.Context<[T, ActionDispatch<[action: [string, unknown]]>]>
    INITIAL_STATE: T
}>): React.ReactElement => {
    const reducer = (state: T, [key, value]: [string, unknown]): T => {
        return {
            ...state,
            [key]: value,
        }
    }
    const [state, dispatch] = useReducer(reducer, INITIAL_STATE)
    return (
        <Context.Provider value={[state, dispatch]}>
            {children}
        </Context.Provider>
    )
}
