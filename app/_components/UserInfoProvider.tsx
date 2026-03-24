'use client'
import { createContext, type PropsWithChildren, useState } from 'react'
import { T_UserSub } from '@common/types'
import { Nullable } from '@common/types'

type Prop = PropsWithChildren<{
    user: Nullable<T_UserSub>
}>

export const UserInfoContext = createContext<{ user: Nullable<T_UserSub>; removeUser: () => void }>({
    user: undefined,
    removeUser: () => {},
})
export function UserInfoProvider({ user: _user, children }: Prop) {
    const [user, setUser] = useState<Nullable<T_UserSub>>(_user)
    const removeUser = () => {
        setUser(undefined) // Reset to the initial default value
    }

    const contextValue = { user, removeUser }

    return <UserInfoContext.Provider value={contextValue}>{children}</UserInfoContext.Provider>
}
