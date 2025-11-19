import jwt from 'jsonwebtoken'
/* Modules */
import Logger from '@src/utils/logger'
/* T_Types */
import type { T_Token } from '@sujin/lib/types'

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
export const verifyToken = (gqlToken: string): T_Token => {
    if (!gqlToken) {
        throw new Error('Missing token')
    }

    return jwt.verify(gqlToken, getSecret('gql')) as T_Token
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
export const verifyAdmin = (gqlToken: string, message: string): void => {
    const user = verifyToken(gqlToken)
    if (!user || !user.admin) {
        Logger.error(`🤬 ${message}`)
        throw new Error(`🤬 ${message}`)
    }
}

/**
 * Get a secret value from environment variables.
 *
 * Supported types:
 * - `'next'`  -> `process.env.NEXTAUTH_SECRET`
 * - `'gql'`   -> `process.env.GQL_SECRET`
 * - `'email'` -> `process.env.EMAIL_SECRET`
 *
 * @param type - The kind of secret to retrieve.
 * @returns The secret string from the environment.
 * @throws {Error} If the requested secret is not set in the environment.
 */
export const getSecret = (type: 'next' | 'gql' | 'email'): string => {
    let secret = ''
    switch (type) {
        case 'next':
            secret = process.env.NEXTAUTH_SECRET || ''
            break
        case 'gql':
            secret = process.env.GQL_SECRET || ''
            break
        case 'email':
            secret = process.env.EMAIL_SECRET || ''
            break
    }

    if (!secret) {
        throw new Error(`Missing secret for type: ${type}`)
    }
    return secret
}
