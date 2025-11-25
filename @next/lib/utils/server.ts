'server-only'
import jwt, { TokenExpiredError } from 'jsonwebtoken'
import { headers, cookies } from 'next/headers'

import {
    COOKIE_KEY_ACCESS_TOKEN,
    COOKIE_KEY_REFRESH_TOKEN,
    COOKIE_KEY_USER_INFO,
    Metadata,
    METADATA,
} from '@lib/constants'
import { DAY_IN_SECONDS, HOUR_IN_SECONDS } from '@sujin/share/constants/datetime'
import type { Nullable } from '@sujin/share/types'
import type { T_Login_Token, T_Token, T_UserSub } from '@sujin/lib/types'
import { HEADER_TOKEN } from '@sujin/lib/constants'
import { refresh } from '@lib/apollo/queries/users/refresh'

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

/**
 * Create the temporary token for verifying origin to @auth server
 *
 * @param origin
 * @returns
 */
export const createLoginToken = (origin: string) => {
    const payload = { iss: origin, sub: `${new Date().getTime()}` } satisfies T_Login_Token
    return jwt.sign(payload, ACCESS_SECRET, { expiresIn: '10m' })
}

export const setCookies = async () => {
    const cookie = await cookies()
    const accessToken = cookie.get('x-token-at')?.value
    const refreshToken = cookie.get('x-token-rt')?.value

    if (!accessToken || !refreshToken) {
        // TODO error
        return
    }

    await storeAccessToken(accessToken)
    await storeUserInfo(accessToken)
    await storeRefreshToken(refreshToken)
}

export const getUserInfo = async (): Promise<Nullable<T_UserSub>> => {
    const cookie = (await cookies()).get(COOKIE_KEY_USER_INFO)
    if (!cookie || !cookie.value) {
        return
    }
    return JSON.parse(cookie.value)
}

export const getAccessToken = async (): Promise<Nullable<string>> => {
    const cookie = (await cookies()).get(COOKIE_KEY_ACCESS_TOKEN)
    if (!cookie || !cookie.value) {
        return
    }
    return cookie.value
}

const verifyAccessToken = async (): Promise<Nullable<string>> => {
    const token = await getAccessToken()
    if (!token) {
        return
    }
    try {
        jwt.verify(token, ACCESS_SECRET) as T_Token
        return token
    } catch (e) {
        if (!(e instanceof TokenExpiredError)) {
            await removeAccessToken()
            throw e
        }

        await refresh().catch(async () => {
            await removeAccessToken()
        })
        const token = await getAccessToken()
        return token
    }
}

export const getRefreshToken = async (): Promise<Nullable<string>> => {
    const cookie = (await cookies()).get(COOKIE_KEY_REFRESH_TOKEN)
    if (!cookie || !cookie.value) {
        return
    }
    return cookie.value
}

export const storeAccessToken = async (token: string) => {
    const cookie = await cookies()
    cookie.set(COOKIE_KEY_ACCESS_TOKEN, token, {
        httpOnly: true,
        secure: true,
        maxAge: 3 * HOUR_IN_SECONDS,
        sameSite: 'lax',
        path: '/',
    })
}

export const storeUserInfo = async (token: string) => {
    const payload = jwt.verify(token, ACCESS_SECRET) as T_Token
    const cookie = await cookies()
    cookie.set(COOKIE_KEY_USER_INFO, payload.sub, {
        httpOnly: true,
        secure: true,
        maxAge: 30 * DAY_IN_SECONDS,
        sameSite: 'lax',
        path: '/',
    })
}

export const removeAccessToken = async () => {
    const cookie = await cookies()
    cookie.delete(COOKIE_KEY_REFRESH_TOKEN)
}

export const storeRefreshToken = async (token: string) => {
    const cookie = await cookies()
    cookie.set(COOKIE_KEY_REFRESH_TOKEN, token, {
        httpOnly: true,
        secure: true,
        maxAge: 30 * DAY_IN_SECONDS,
        sameSite: 'strict',
        path: '/',
    })
}

export const getAuthHeader = async () => {
    const token = await verifyAccessToken()
    if (!token) {
        return {}
    }
    return { headers: { [HEADER_TOKEN]: `Bearer ${token}` } }
}

export const logout = async (): Promise<Nullable<void>> => {
    const cookieStore = await cookies()
    cookieStore.delete(COOKIE_KEY_USER_INFO)
    cookieStore.delete(COOKIE_KEY_ACCESS_TOKEN)
    cookieStore.delete(COOKIE_KEY_REFRESH_TOKEN)
}
