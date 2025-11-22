import { setCookies } from '@lib/utils/server'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    await setCookies()
    const url = new URL(request.url)
    const pathname = url.pathname.replace('/auth/redirect', '')
    return Response.redirect(`${url.origin}${pathname === '/root' ? '/' : pathname}`)
}
