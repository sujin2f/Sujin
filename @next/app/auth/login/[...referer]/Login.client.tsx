'use client'
import { useRouter } from 'next/navigation'

type Props = {
    referer: string[]
    token: string
}

export function LoginClient({ referer, token }: Props) {
    const router = useRouter()
    const url = new URL(window.location.href)

    const redirect = `${url.origin}/auth/redirect/${referer.join('/')}`
    const loginURL = `${process.env.NEXT_PUBLIC_AUTH_ENDPOINT}/auth?redirect=${encodeURIComponent(
        redirect,
    )}&token=${token}`

    router.replace(loginURL)
    return <></>
}
