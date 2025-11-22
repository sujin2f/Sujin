import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
/* Utils */
import { DAY_IN_SECONDS, HOUR_IN_SECONDS } from '@sujin/share/constants/datetime'

type Props = {
    params: Promise<{
        referer: string[]
    }>
}

export default async function LoggedIn({ params }: Props) {
    const { referer } = await params
    const cookie = await cookies()
    const accessToken = cookie.get('x-token-at')?.value
    const refreshToken = cookie.get('x-token-rt')?.value

    if (!accessToken || !refreshToken) {
        // TODO error
        redirect(`/${referer.join('/')}`)
    }

    cookie.set('sessionAT', accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 3 * HOUR_IN_SECONDS,
        sameSite: 'lax',
        path: '/',
    })

    cookie.set('sessionRT', refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 30 * DAY_IN_SECONDS,
        sameSite: 'strict',
        path: '/auth/refresh',
    })

    redirect(`/${referer.join('/')}`)
}
