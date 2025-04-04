'use client'
import { useRouter } from 'next/navigation'

type Props = {
    url?: string
    refresh?: boolean
}

export const Redirect = ({ url, refresh }: Props) => {
    const router = useRouter()
    if (url) {
        router.replace(url)
    }
    if (refresh) {
        router.refresh()
    }
    return <></>
}
