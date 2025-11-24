import { useRouter } from 'next/navigation'
import { COOKIE_KEY_USER_INFO } from '@lib/constants'

export const useLogInOut = () => {
    const router = useRouter()
    const logout = (pathname: string) => {
        localStorage.removeItem(COOKIE_KEY_USER_INFO)
        router.push(`/auth/logout/${encodeURI(pathname)}`)
    }
    const login = (pathname: string) => {
        router.push(`/auth/login/${encodeURI(pathname)}`)
    }
    return { login, logout }
}
