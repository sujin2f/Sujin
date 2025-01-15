import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname
    const origin = request.nextUrl.origin
    const path =
        pathname.indexOf('/page/') + 1
            ? `/archive${pathname}`
            : `/archive${pathname}/page/1`

    return NextResponse.redirect(new URL(`${origin}${path}`))
}

export const config = {
    matcher: [
        '/(category|tag|search)/:slug',
        '/(category|tag|search)/:slug/page/:page',
    ],
}
