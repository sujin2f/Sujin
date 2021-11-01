/** store */
import React, { createContext, useReducer } from 'react'
import { reducer, initialState } from 'src/frontend/store/reducer'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ReactChildrenProps, State } from 'src/types'

export const Context = createContext([initialState, null])
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Context = [State, any]

export const Store = ({ children }: ReactChildrenProps): React.ReactElement => {
    const [state, dispatch]: Context = useReducer(reducer, initialState)
    return (
        <Context.Provider value={[state, dispatch]}>
            {children}
        </Context.Provider>
    )
}

export {
    setPageInfo,
    loadBackgroundInit,
    loadBackgroundSuccess,
    loadBackgroundFail,
    loadMenuInit,
    loadMenuSuccess,
    loadPostInit,
    loadPostSuccess,
    loadPostFail,
    loadArchiveInit,
    loadArchiveSuccess,
    loadArchiveFail,
    loadFlickrInit,
    loadFlickrSuccess,
    loadFlickrFail,
} from 'src/frontend/store/actions'
