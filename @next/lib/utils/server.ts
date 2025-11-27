'server-only'
import { headers, cookies } from 'next/headers'
import type { DefaultContext } from '@apollo/client'
/* Models */
import { Logger } from '@sujin/share/model/Logger'
/* CONSTANTS */
import {
    COOKIE_KEY_ACCESS_TOKEN,
    COOKIE_KEY_REFRESH_TOKEN,
    COOKIE_KEY_USER_INFO,
    Metadata,
    METADATA,
} from '@lib/constants'
import { DAY_IN_SECONDS, HOUR_IN_SECONDS, SECOND_IN_MS } from '@sujin/share/constants/datetime'
import { HEADER_TOKEN } from '@sujin/lib/constants'
/* T_Types */
import type { Nullable } from '@sujin/share/types'
import type { T_UserSub } from '@sujin/lib/types'
/* Utils */
import { refresh } from '@lib/apollo/queries/users/refresh'
import { generateToken, verifyToken, getExpiration } from '@sujin/lib/utils/token'

const INTER_COM_SECRET = `${process.env.INTER_COM_SECRET}`
const CRYPTO_KEY = `${process.env.CRYPTO_KEY}`

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

/**
 * Create the temporary token for verifying origin to @auth server
 *
 * @param redirect
 * @returns
 */
export const createLoginToken = async (redirect: string) => {
    return await generateToken({ redirect }, 10, INTER_COM_SECRET, CRYPTO_KEY)
}

export const setCookies = async (token: string) => {
    const { user, accessToken, refreshToken } = await verifyToken<{
        user: T_UserSub
        accessToken: string
        refreshToken: string
    }>(token, INTER_COM_SECRET, CRYPTO_KEY)

    await storeUserInfo(user)
    await storeAccessToken(accessToken)
    await storeRefreshToken(refreshToken)

    getSafeAccessToken(accessToken)
    Logger.info('🤟 Sessions!')
}

export const isAdmin = async () => {
    const user = await getUserInfo()
    return user?.admin
}

const getAccessToken = async (): Promise<Nullable<string>> => {
    const cookie = (await cookies()).get(COOKIE_KEY_ACCESS_TOKEN)
    if (!cookie || !cookie.value) {
        return
    }
    if (!cookie.value) {
        return
    }
    return cookie.value
}

const getSafeAccessToken = async (_token: Nullable<string>): Promise<Nullable<string>> => {
    let token = _token
    if (!token) {
        return
    }

    const now = Math.trunc(new Date().getTime() / SECOND_IN_MS) + 60
    const exp = getExpiration(token) || 0

    // expired
    if (now > exp) {
        await refresh()
        token = await getAccessToken()
    }

    return token
}

export const getRefreshToken = async (): Promise<Nullable<string>> => {
    const cookie = (await cookies()).get(COOKIE_KEY_REFRESH_TOKEN)
    if (!cookie || !cookie.value) {
        return
    }
    return cookie.value
}

/**
 * Userinfo
 * @param token
 */
const storeUserInfo = async (token: T_UserSub) => {
    const cookie = await cookies()
    cookie.set(COOKIE_KEY_USER_INFO, JSON.stringify(token), {
        httpOnly: true,
        secure: true,
        maxAge: 30 * DAY_IN_SECONDS,
        sameSite: 'lax',
        path: '/',
    })
}

export const getUserInfo = async (): Promise<Nullable<T_UserSub>> => {
    Logger.info('🤟 getUserInfo started')
    const cookie = (await cookies()).get(COOKIE_KEY_USER_INFO)
    if (!cookie || !cookie.value) {
        return
    }
    return JSON.parse(cookie.value)
}

/**
 * Access token
 * @param token
 */
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

/**
 * Refresh token
 * @param token
 */
const storeRefreshToken = async (token: string) => {
    const cookie = await cookies()
    cookie.set(COOKIE_KEY_REFRESH_TOKEN, token, {
        httpOnly: true,
        secure: true,
        maxAge: 30 * DAY_IN_SECONDS,
        sameSite: 'strict',
        path: '/',
    })
}

export const getAuthHeader = async (): Promise<DefaultContext> => {
    const _token = await getAccessToken()
    const token = await getSafeAccessToken(_token)
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
