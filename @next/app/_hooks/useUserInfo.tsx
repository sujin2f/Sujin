import { useContext } from 'react'
import { UserInfoContext } from '@lib/components/UserInfoProvider'

export const useUserInfo = () => {
    const { user } = useContext(UserInfoContext)
    return user
}
