import jwt from 'jsonwebtoken'
/* Modules */
import { Logger } from '@sujin/share/model/Logger'
/* Utils */
import { isUserAdmin } from '@src/utils/mysql/isUserAdmin'
/* T_Types */
import type { T_Parsed_Token, T_Token, T_UserSub } from '@sujin/lib/types'
import { SECOND_IN_MS } from '@sujin/share/constants/datetime'
import { REFRESH_TOKEN_LIFETIME } from '@sujin/lib/constants'

/**
 * Security helper utilities for JWT verification and secret retrieval.
 *
 * Contains functions used by resolvers and API routes to validate JSON
 * Web Tokens (JWTs) and to fetch secrets from environment variables.
 */

/**
 * Verify a GraphQL JWT and return the decoded token payload.
 *
 * @param gqlToken - The JWT string to verify (expected to be a GraphQL auth token).
 * @returns The decoded token payload typed as `T_Token`.
 * @throws {Error} If `gqlToken` is falsy, or if verification fails (will rethrow
 * the underlying `jsonwebtoken` error). If the token is expired, callers may
 * choose to attempt re-validation depending on their flow.
 */
export const verifyToken = (gqlToken: string): T_Parsed_Token => {
    if (!gqlToken) {
        throw new Error('Missing token')
    }

    const token = jwt.verify(gqlToken, getSecret('access'))
    if (typeof token === 'string') {
        throw new Error('Token is invalid')
    }

    if (typeof token.sub !== 'string') {
        throw new Error('Token is invalid')
    }

    const sub = JSON.parse(token.sub)
    return { ...token, sub } as T_Parsed_Token
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
export const verifyAdmin = async (gqlToken: string, message: string): Promise<boolean> => {
    const token = verifyToken(gqlToken)
    if (!token || !token.sub) {
        if (!message) {
            return false
        }
        Logger.error(`🤬 ${message}`)
        throw new Error(`🤬 ${message}`)
    }

    if (!token.sub.admin) {
        if (!message) {
            return false
        }
        Logger.error(`🤬 ${message}`)
        throw new Error(`🤬 ${message}`)
    }

    if (!(await isUserAdmin(token.sub.email))) {
        if (!message) {
            return false
        }
        Logger.error(`🤬 ${message}`)
        throw new Error(`🤬 ${message}`)
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
