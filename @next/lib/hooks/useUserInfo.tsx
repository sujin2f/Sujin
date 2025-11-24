import { SessionContext } from '@lib/components/UserInfoProvider'
import { useContext } from 'react'

export const useUserInfo = () => {
    const user = useContext(SessionContext)
    return user
}
