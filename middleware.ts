import { NextResponse, type NextRequest } from 'next/server'

const GRAPHQL_ALLOW_ORIGINS = (process.env.GRAPHQL_ALLOW_ORIGINS || '').split(
    ' ',
)
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
        '/api/graphql',
    ],
}

/**
 * Allow custom origin URL to access into GQL
 *
 * @param {string} pathname
 * @param {string} origin
 * @returns {NextResponse | void}
 */
const graphqlCors = (
    pathname: string,
    origin: string,
): NextResponse<unknown> | void => {
    if (pathname.indexOf('/api/graphql') === -1) {
        return
    }

    if (GRAPHQL_ALLOW_ORIGINS.indexOf(origin) === -1) {
        return
    }

    const response = new NextResponse()
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept',
    )
    return response
}

/**
 * Redirect WP archive URL
 *
 * @param {string} pathname
 * @param {string} origin
 * @returns {NextResponse | void}
 */
const redirectArchive = (
    pathname: string,
    origin: string,
): NextResponse<unknown> | void => {
    const isArchive = pathname.match(REGEX_ARCHIVE)
    if (!isArchive) {
        return
    }
    const path = `/archive/${isArchive[1]}/${isArchive[2]}/page/${
        isArchive[4] || 1
    }`
    return NextResponse.redirect(new URL(`${origin}${path}`))
}

/**
 * Redirect WP single URL
 *
 * @param {string} pathname
 * @param {string} origin
 * @returns {NextResponse | void}
 */
const redirectSingle = (
    pathname: string,
    origin: string,
): NextResponse<unknown> | void => {
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

    // GQL CORS
    const responseGQL = graphqlCors(pathname, origin)
    if (responseGQL) {
        return responseGQL
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
