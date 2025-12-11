import { useContext } from 'react'
import { UserInfoContext } from '@app/_components/UserInfoProvider'

export const useUserInfo = () => {
    const { user } = useContext(UserInfoContext)
    return user
}
