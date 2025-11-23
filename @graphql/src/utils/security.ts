import jwt from 'jsonwebtoken'
/* Utils */
import { isUserAdmin } from '@src/utils/mysql/isUserAdmin'
/* T_Types */
import type { T_Parsed_Token, T_Token, T_UserSub } from '@sujin/lib/types'
import { SECOND_IN_MS } from '@sujin/share/constants/datetime'
import { ACCESS_TOKEN_LIFETIME, REFRESH_TOKEN_LIFETIME } from '@sujin/lib/constants'
import { User } from '@src/schema/users'
import { createHash } from '@sujin/share/utils/crypto'
import sanitize from 'mongo-sanitize'

/**
 * Security helper utilities for JWT verification and secret retrieval.
 *
 * Contains functions used by resolvers and API routes to validate JSON
 * Web Tokens (JWTs) and to fetch secrets from environment variables.
 */

/**
 * Verify a access token and return the decoded token payload.
 *
 * @param   {string}         token - The JWT string to verify (expected to be a GraphQL auth token).
 * @returns {T_Parsed_Token} The decoded token payload typed as `T_Parsed_Token`.
 * @throws  {Error}          If `token` is falsy, or if verification fails (will rethrow
 *                           the underlying `jsonwebtoken` error). If the token is expired, callers may
 *                           choose to attempt re-validation depending on their flow.
 */
export const verifyAccessToken = async (token: string): Promise<T_Parsed_Token> => {
    if (!token) {
        throw new Error('Missing token')
    }

    const payload = jwt.verify(token, getSecret('access')) as T_Token
    if (typeof payload === 'string') {
        throw new Error('🤬 Token is invalid')
    }

    if (typeof payload.sub !== 'string') {
        throw new Error('🤬 Token is invalid')
    }

    const user = JSON.parse(payload.sub) as T_UserSub
    if (user.admin) {
        verifyAdmin(user.email)
    }

    const email = createHash(user.email, getSecret('email'))
    await User.findOne({ _id: user._id, email }).then((result) => {
        if (!result) throw new Error('🤬 Cannot find the user!')
    })
    return { ...payload, sub: user }
}

/**
 * Verify refresh token and return the new access token.
 *
 * @param   {string} token - The JWT string to verify (expected to be a refresh token).
 * @returns {string} The new access token.
 * @throws  {Error}  If `token` is falsy, or if verification fails (will rethrow
 *                   the underlying `jsonwebtoken` error). If the token is expired, callers may
 *                   choose to attempt re-validation depending on their flow.
 */
export const refreshAccessToken = (token: string): string => {
    if (!token) {
        throw new Error('Missing token')
    }

    const payload = jwt.verify(token, getSecret('refresh'))
    if (typeof payload === 'string') {
        throw new Error('Token is invalid')
    }

    if (typeof payload.sub !== 'string') {
        throw new Error('Token is invalid')
    }

    // issue, verify, and return
    const iat = new Date().getTime() / SECOND_IN_MS
    const accessPayload = {
        ...payload,
        iat,
        exp: iat + ACCESS_TOKEN_LIFETIME,
    } as T_Token
    const accessToken = jwt.sign(accessPayload, getSecret('access'))
    verifyAccessToken(accessToken)
    return accessToken
}

/**
 * Verify that the provided token belongs to an admin user.
 *
 * Logs an error and throws when the token is invalid or the user is not an admin.
 *
 * @param gqlToken - The JWT string to verify.
 * @param message - A human-friendly message used for logging and the thrown error.
 * @throws {Error} If token verification fails or the decoded token does not
 * contain an `admin` truthy flag.
 */
const verifyAdmin = async (_email: string): Promise<boolean> => {
    const email = sanitize(_email)

    if (!(await isUserAdmin(email))) {
        throw new Error(`🤬 User is not admin`)
    }
    return true
}

/**
 * Get a secret value from environment variables.
 *
 * Supported types:
 * - `'access'`   -> `process.env.ACCESS_SECRET`
 * - `'email'` -> `process.env.EMAIL_SECRET`
 *
 * @param type - The kind of secret to retrieve.
 * @returns The secret string from the environment.
 * @throws {Error} If the requested secret is not set in the environment.
 */
export const getSecret = (type: 'access' | 'refresh' | 'email'): string => {
    let secret = ''
    switch (type) {
        case 'access':
            secret = `${process.env.ACCESS_SECRET}`
            break
        case 'refresh':
            secret = `${process.env.REFRESH_SECRET}`
            break
        case 'email':
            secret = `${process.env.EMAIL_SECRET}`
            break
    }

    if (!secret) {
        throw new Error(`Missing secret for type: ${type}`)
    }
    return secret
}

export const createRefreshToken = (user: T_UserSub): string => {
    const iat = new Date().getTime() / SECOND_IN_MS
    const payload: T_Token = {
        iss: 'https://sujinc.com',
        iat,
        exp: iat + REFRESH_TOKEN_LIFETIME,
        sub: JSON.stringify(user),
    }
    return jwt.sign(payload, getSecret('refresh'))
}
