import { NextRequest } from 'next/server'
/* Utils */
import { createLoginToken } from '@lib/utils/server'
/* Models */
import { Logger } from '@sujin/share/model/Logger'

const getLoginURL = (request: NextRequest) => {
    const url = new URL(request.url)
    const token = createLoginToken(`${process.env.NEXT_PUBLIC_BASE_URL}`)
    const redirect = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/redirect/${url.pathname.replace('/auth/login/', '')}`
    const loginURL = `${process.env.NEXT_PUBLIC_AUTH_ENDPOINT}/google/auth?redirect=${encodeURIComponent(
        redirect,
    )}&token=${token}`

    return loginURL
}

export async function GET(request: NextRequest) {
    Logger.info('🤟 login started!')
    return Response.redirect(getLoginURL(request))
}
