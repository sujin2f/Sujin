import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname
    const isArchive = pathname.match(
        /^\/(category|tag|search)\/([^\/]+)(\/page\/(\d+))?$/,
    )
    if (isArchive) {
        const origin = request.nextUrl.origin
        const path = `/archive/${isArchive[1]}/${isArchive[2]}/page/${
            isArchive[4] || 1
        }`
        return NextResponse.redirect(new URL(`${origin}${path}`))
    }

    const isSingle = pathname.match(/^\/(\d+)\/(\d+)\/(\d+)\/(.+)$/)
    if (isSingle) {
        const origin = request.nextUrl.origin
        const path = `/blog/${isSingle[4]}`
        return NextResponse.redirect(new URL(`${origin}${path}`))
    }

    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-pathname', request.nextUrl.pathname)

    const response = NextResponse.next({
        request: {
            // New request headers
            headers: requestHeaders,
        },
    })
    response.headers.set('x-pathname', request.nextUrl.pathname)

    return response
}

export const config = {
    matcher: [
        '/(category|tag|search)/:slug',
        '/(category|tag|search)/:slug/page/:page',
        '/:year/:month/:date/:slug',
        '/dev-tools/:slug',
        '/ether(.*)',
    ],
}
