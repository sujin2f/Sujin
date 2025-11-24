import { NextRequest } from 'next/server'
import { createLoginToken } from '@lib/utils/server'

const getLoginURL = (request: NextRequest) => {
    const url = new URL(request.url)
    const token = createLoginToken(url.origin)
    const redirect = `${url.origin}/auth/redirect/${url.pathname.replace('/auth/login/', '')}`
    const loginURL = `${process.env.NEXT_PUBLIC_AUTH_ENDPOINT}/auth?redirect=${encodeURIComponent(
        redirect,
    )}&token=${token}`

    return loginURL
}

export async function GET(request: NextRequest) {
    return Response.redirect(getLoginURL(request))
}
