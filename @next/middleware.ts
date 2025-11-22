import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const REGEX_ARCHIVE = /^\/(category|tag|search)\/([^\/]+)(\/page\/(\d+))?$/
const REGEX_SINGLE = /^\/(\d+)\/(\d+)\/(\d+)\/(.+)$/

export const config = {
    matcher: [
        '/',
        '/(category|tag|search)/:slug',
        '/(category|tag|search)/:slug/page/:page',
        '/:year/:month/:date/:slug',
        '/dev-tools/:slug',
        '/ether(.*)',
        '/auth(.*)',
    ],
}

/**
 * Redirect WP archive URL
 *
 * @param {string} pathname
 * @param {string} origin
 * @returns {NextResponse | void}
 */
const redirectArchive = (pathname: string, origin: string): NextResponse<unknown> | void => {
    const isArchive = pathname.match(REGEX_ARCHIVE)
    if (!isArchive) {
        return
    }
    const path = `/archive/${isArchive[1]}/${isArchive[2]}/page/${isArchive[4] || 1}`
    return NextResponse.redirect(new URL(`${origin}${path}`))
}

/**
 * Redirect WP single URL
 *
 * @param {string} pathname
 * @param {string} origin
 * @returns {NextResponse | void}
 */
const redirectSingle = (pathname: string, origin: string): NextResponse<unknown> | void => {
    const isSingle = pathname.match(REGEX_SINGLE)
    if (!isSingle) {
        return
    }
    const path = `/blog/${isSingle[4]}`
    return NextResponse.redirect(new URL(`${origin}${path}`))
}

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname
    const origin = request.nextUrl.origin

    // Login
    if (pathname.startsWith('/auth/login')) {
        const headers = new Headers(request.headers)
        headers.set('x-origin', origin)
        const response = NextResponse.next({
            request: {
                headers,
            },
        })
        response.headers.set('x-origin', origin)
        return response
    }

    // Archive redirection
    const responseArchive = redirectArchive(pathname, origin)
    if (responseArchive) {
        return responseArchive
    }
    // Single redirection
    const responseSingle = redirectSingle(pathname, origin)
    if (responseSingle) {
        return responseSingle
    }

    // Add pathname header
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
