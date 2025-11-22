'server-only'
import jwt from 'jsonwebtoken'
import { headers, cookies } from 'next/headers'
import type { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'

import {
    COOKIE_KEY_ACCESS_TOKEN,
    COOKIE_KEY_REFRESH_TOKEN,
    COOKIE_KEY_USER_INFO,
    Metadata,
    METADATA,
} from '@lib/constants'
import { DAY_IN_SECONDS, HOUR_IN_SECONDS } from '@sujin/share/constants/datetime'
import type { Nullable } from '@sujin/share/types'
import type { T_Token, T_UserSub } from '@sujin/lib/types'

/**
 * Retrieves the current pathname from the headers.
 *
 * This function fetches the value of the `x-pathname` header and returns it.
 * If the header is not found, it returns `undefined`.
 *
 * @async
 * @returns {Promise<Nullable<string>>} The pathname as a string if found, otherwise `undefined`.
 */
const getPathName = async (): Promise<Nullable<string>> => (await headers()).get('x-pathname') || undefined

/**
 * Retrieves metadata based on the current pathname.
 *
 * This function fetches the current pathname from the headers and looks up
 * the corresponding metadata from the `METADATA` object. If the pathname
 * is not available or the metadata is not found for the given path, an error
 * is thrown.
 *
 * @async
 * @returns {Promise<Metadata>} The metadata corresponding to the current pathname.
 * @throws {Error} If the pathname is not found or metadata for the path is missing.
 */
export const getMetaData = async (): Promise<Metadata> => {
    const path = await getPathName()
    if (!path || !METADATA[path]) {
        throw Error('Cannot get metadata.')
    }
    return METADATA[path]
}

const ACCESS_SECRET = `${process.env.ACCESS_SECRET}`

export const createLoginToken = (origin: string) => {
    return jwt.sign({ origin, rand: new Date().getTime() }, ACCESS_SECRET, { expiresIn: '10m' })
}

export const verifyAccessToken = <T>(token: string) => {
    return jwt.verify(token, ACCESS_SECRET) as T
}

export const setCookies = async () => {
    const cookie = await cookies()
    const accessToken = cookie.get('x-token-at')?.value
    const refreshToken = cookie.get('x-token-rt')?.value

    if (!accessToken || !refreshToken) {
        // TODO error
        return
    }

    const token = verifyAccessToken<T_Token>(accessToken)
    const sub = JSON.parse(token.sub)
    const userInfo = JSON.stringify({ ...token, sub })
    const options: Partial<ResponseCookie> = {
        httpOnly: true,
        secure: true,
        maxAge: 3 * HOUR_IN_SECONDS,
        sameSite: 'lax',
        path: '/',
    }

    cookie.set(COOKIE_KEY_USER_INFO, userInfo, options)
    cookie.set(COOKIE_KEY_ACCESS_TOKEN, accessToken, options)
    cookie.set(COOKIE_KEY_REFRESH_TOKEN, refreshToken, {
        ...options,
        maxAge: 30 * DAY_IN_SECONDS,
        sameSite: 'strict',
        path: '/auth/refresh',
    })
}

export const getUserInfo = async (): Promise<Nullable<T_UserSub>> => {
    const cookie = (await cookies()).get(COOKIE_KEY_USER_INFO)
    if (!cookie || !cookie.value) {
        return
    }

    const token = JSON.parse(cookie.value)
    return token.sub
}

export const getAccessToken = async (): Promise<Nullable<string>> => {
    const cookie = (await cookies()).get(COOKIE_KEY_ACCESS_TOKEN)
    if (!cookie || !cookie.value) {
        return
    }
    return cookie.value
}

// TODO run on background
export const requestRefresh = async () => {}

export const getAuthHeader = async () => {
    const token = await getAccessToken().catch(() => false)
    if (!token) {
        return {}
    }
    return { headers: { Authorization: `Bearer ${token}` } }
}

export const logout = async (): Promise<Nullable<void>> => {
    const cookieStore = await cookies()
    cookieStore.delete(COOKIE_KEY_USER_INFO)
    cookieStore.delete(COOKIE_KEY_ACCESS_TOKEN)
    cookieStore.delete(COOKIE_KEY_REFRESH_TOKEN)
}
