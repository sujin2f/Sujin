import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
/* Components */
import { LoginClient } from '@app/auth/login/[...referer]/Login.client'
/* Utils */
import { createLoginToken } from '@lib/utils/session'

type Props = {
    params: Promise<{
        referer: string[]
    }>
}

export default async function Login({ params }: Props) {
    const { referer } = await params
    const origin = (await headers()).get('x-origin')
    if (!origin) {
        // TODO error
        redirect(referer.join('/'))
    }
    const token = createLoginToken(origin)

    return <LoginClient referer={referer} token={token} />
}
