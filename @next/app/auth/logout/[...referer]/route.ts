import { NextRequest } from 'next/server'
import { logout } from '@lib/utils/server'

export async function GET(request: NextRequest) {
    await logout()

    const url = new URL(request.url)
    const pathname = url.pathname.replace('/auth/logout', '')
    return Response.redirect(`${url.origin}${pathname === '/root' ? '/' : pathname}`)
}
