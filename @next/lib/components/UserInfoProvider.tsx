'use client'
import { T_UserSub } from '@sujin/lib/types'
import { Nullable } from '@sujin/share/types'
import { createContext, PropsWithChildren } from 'react'

type Prop = PropsWithChildren<{
    user: Nullable<T_UserSub>
}>

export const SessionContext = createContext<Nullable<T_UserSub>>(null)
export function UserInfoProvider({ user, children }: Prop) {
    return <SessionContext.Provider value={user}>{children}</SessionContext.Provider>
}
