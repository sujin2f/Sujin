import { useContext } from 'react'
import { useRouter } from 'next/navigation'

import { UserInfoContext } from '@lib/components/UserInfoProvider'

export const useLogInOut = () => {
    const router = useRouter()
    const { removeUser } = useContext(UserInfoContext)

    const logout = (pathname: string) => {
        removeUser()
        router.push(`/auth/logout/${encodeURI(pathname)}`)
    }
    const login = (pathname: string) => {
        router.push(`/auth/login/${encodeURI(pathname)}`)
    }
    return { login, logout }
}
