import { logout as logoutAction } from '@lib/utils/server'
import { useRouter } from 'next/navigation'

export const useLogout = () => {
    const router = useRouter()

    const logout = async () => {
        'use server'
        await logoutAction().finally(() => {
            router.refresh()
        })
    }
    return logout
}
