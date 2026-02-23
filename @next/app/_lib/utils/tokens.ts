'server-only'
import { cookies } from 'next/headers'
import type { DefaultContext } from '@apollo/client'
/* Models */
import { Logger } from '@sujin/share/model/Logger'
/* CONSTANTS */
import { COOKIE_KEY_ACCESS_TOKEN, COOKIE_KEY_REFRESH_TOKEN, COOKIE_KEY_USER_INFO } from '@lib/constants'
import { DAY_IN_SECONDS, HOUR_IN_SECONDS, SECOND_IN_MS } from '@sujin/share/constants/datetime'
/* T_Types */
import type { Nullable } from '@sujin/share/types'
import type { T_UserSub } from '@sujin/lib/types'
/* Utils */
import {
    generateToken,
    verifyToken,
    getExpiration,
    createAuthHeader,
    getAuthHeader as getAuthHeaderFromHeader,
} from '@sujin/lib/utils/token'

/**
 * Internal communication functions that uses next/headers
 */

const INTER_COM_SECRET = `${process.env.INTER_COM_SECRET}`
const CRYPTO_KEY = `${process.env.CRYPTO_KEY}`

/**
 * Create the temporary token for verifying origin to @auth server
 *
 * @param redirect
 * @returns
 */
export const createLoginToken = async (redirect: string) => {
    return await generateToken(redirect, 10, INTER_COM_SECRET, CRYPTO_KEY)
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

    Logger.info('🤞 Sessions!')
}

export const isAdmin = async () => {
    const user = await getUserInfo()
    return user?.admin
}

export const getAccessToken = async (): Promise<Nullable<string>> => {
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
        await refreshAccessToken()
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
    return createAuthHeader(token)
}

export const logout = async (): Promise<Nullable<void>> => {
    const cookieStore = await cookies()
    cookieStore.delete(COOKIE_KEY_USER_INFO)
    cookieStore.delete(COOKIE_KEY_ACCESS_TOKEN)
    cookieStore.delete(COOKIE_KEY_REFRESH_TOKEN)
}

export const refreshAccessToken = async (_token: string = ''): Promise<undefined> => {
    Logger.info('🤞 refresh token start!')
    const token = _token || (await getRefreshToken())
    if (!token) {
        throw new Error()
    }

    const body = {
        query: `
        mutation {
            refresh
        }`,
    }

    await fetch(`${process.env.GQL_BASE_URL}`, {
        method: 'POST',
        headers: {
            ...createAuthHeader(token).headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    })
        .then(async (response) => {
            if (response.status !== 200) {
                throw new Error()
            }

            const token = getAuthHeaderFromHeader(response.headers)
            if (!token) {
                throw new Error()
            }

            Logger.info('⭐️ refresh token done!')
            await storeAccessToken(token)
        })
        .catch((e) => {
            Logger.error(`🤬 refresh token failed! ${JSON.stringify(e)}`)
            throw e
        })
}
