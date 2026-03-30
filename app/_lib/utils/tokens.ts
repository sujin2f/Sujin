'server-only'
import { cookies } from 'next/headers'
import type { DefaultContext } from '@apollo/client'
/* Models */
import { Logger } from '@common/model/Logger'
/* CONSTANTS */
import { COOKIE_KEY_ACCESS_TOKEN, COOKIE_KEY_REFRESH_TOKEN, COOKIE_KEY_USER_INFO } from '@app/_lib/constants'
import { SECOND_IN_MS } from '@common/constants/datetime'
/* T_Types */
import type { T_UserSub } from '@common/types'
/* Utils */
import { generateToken, verifyToken, getExpiration, createAuthHeader, getTokenFromHeader } from '@common/utils/token'
import { ACCESS_TOKEN_LIFETIME, REFRESH_TOKEN_LIFETIME } from '@common/constants'

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

    Logger.info('Sessions!')
}

export const isAdmin = async () => {
    Logger.log('isAdmin()')
    const user = await getUserInfo()
    return user?.admin
}

export const getAccessToken = async (): Promise<string> => {
    Logger.log('getAccessToken()')
    const cookie = (await cookies()).get(COOKIE_KEY_ACCESS_TOKEN)
    if (!cookie || !cookie.value) {
        throw Logger.throw('getAccessToken(): cookie empty.')
    }
    return cookie.value
}

const getSafeAccessToken = async (): Promise<string> => {
    Logger.log('getSafeAccessToken()')
    const token = await getAccessToken()
    if (!token) {
        const refresh = await getRefreshToken()
        if (!refresh)
            throw Logger.throw('getSafeAccessToken() has been failed: neither access nor refresh do not exist.')

        await refreshAccessToken()
        return await getAccessToken()
    }

    const now = Math.trunc(new Date().getTime() / SECOND_IN_MS) + 60
    const exp = getExpiration(token) || 0

    // expired
    if (now > exp) {
        await refreshAccessToken()
        return await getAccessToken()
    }

    return token
}

export const getRefreshToken = async (): Promise<string> => {
    Logger.log('getRefreshToken()')
    const cookie = (await cookies()).get(COOKIE_KEY_REFRESH_TOKEN)
    if (!cookie || !cookie.value) {
        throw Logger.throw('getRefreshToken(): cookie empty.')
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
        maxAge: REFRESH_TOKEN_LIFETIME,
        sameSite: 'lax',
        path: '/',
    })
}

export const getUserInfo = async (): Promise<T_UserSub> => {
    const cookie = (await cookies()).get(COOKIE_KEY_USER_INFO)
    if (!cookie || !cookie.value) {
        throw Logger.throw('getUserInfo(): cookie empty.')
    }
    return JSON.parse(cookie.value)
}

/**
 * Access token
 * @param token
 */
export const storeAccessToken = async (token: string) => {
    Logger.log('storeAccessToken()', token)
    const cookie = await cookies()
    cookie.set(COOKIE_KEY_ACCESS_TOKEN, token, {
        httpOnly: true,
        secure: true,
        maxAge: ACCESS_TOKEN_LIFETIME,
        sameSite: 'lax',
        path: '/',
    })
}

/**
 * Refresh token
 * @param token
 */
const storeRefreshToken = async (token: string) => {
    Logger.log('storeRefreshToken()', token)
    const cookie = await cookies()
    cookie.set(COOKIE_KEY_REFRESH_TOKEN, token, {
        httpOnly: true,
        secure: true,
        maxAge: REFRESH_TOKEN_LIFETIME,
        sameSite: 'strict',
        path: '/',
    })
}

export const getAuthHeader = async (): Promise<DefaultContext> => {
    Logger.log('getAuthHeader()')
    const token = await getSafeAccessToken().catch(async (e) => {
        await logout()
        throw e
    })
    return createAuthHeader(token)
}

export const logout = async (): Promise<void> => {
    Logger.log('logout()')
    const cookieStore = await cookies()
    cookieStore.delete(COOKIE_KEY_USER_INFO)
    cookieStore.delete(COOKIE_KEY_ACCESS_TOKEN)
    cookieStore.delete(COOKIE_KEY_REFRESH_TOKEN)
}

export const refreshAccessToken = async (): Promise<undefined> => {
    Logger.log('refreshAccessToken()')
    const token = await getRefreshToken()

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
                throw Logger.throw(`refresh token failed!`, response.status)
            }

            const token = getTokenFromHeader(response.headers)
            if (!token) {
                throw Logger.throw(`refresh token failed! | token is empty`)
            }

            Logger.info('refresh token done!')
            await storeAccessToken(token)
        })
        .catch((e) => {
            Logger.error(`refresh token failed!`, JSON.stringify(e))
            throw e
        })
}
