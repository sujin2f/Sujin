import { SessionContext } from '@lib/components/header/SessionProvider'
import { useContext } from 'react'

export const useUserInfo = () => {
    const user = useContext(SessionContext)
    return user
}
