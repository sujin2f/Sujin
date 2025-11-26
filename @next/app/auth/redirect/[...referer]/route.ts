import type { NextRequest } from 'next/server'
/* Utils */
import { setCookies } from '@lib/utils/server'

export async function GET(request: NextRequest) {
    await setCookies()
    const url = new URL(request.url)
    const pathname = url.pathname.replace('/auth/redirect', '')
    return Response.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}${pathname === '/root' ? '/' : pathname}`)
}
