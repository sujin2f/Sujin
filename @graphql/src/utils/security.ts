import sanitize from 'mongo-sanitize'
/* Models */
import { User } from '@src/schema/users'
/* Utils */
import { isUserAdmin } from '@src/utils/mysql/isUserAdmin'
import { createHash } from '@sujin/share/utils/crypto'
/* T_Types */
import type { T_UserSub } from '@sujin/lib/types'
/* CONSTANTS */
import { verifyToken } from '@sujin/lib/utils/token'

const ACCESS_SECRET = `${process.env.ACCESS_SECRET}`
const EMAIL_SECRET = `${process.env.EMAIL_SECRET}`
const CRYPTO_KEY = `${process.env.CRYPTO_KEY}`

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
export const verifyAccessToken = async (token: string): Promise<T_UserSub> => {
    const user = await verifyToken<T_UserSub>(token, ACCESS_SECRET, CRYPTO_KEY)
    if (user.admin) {
        verifyAdmin(user.email)
    }

    const email = createHash(user.email, EMAIL_SECRET)
    await User.findOne({ _id: user._id, email }).then((result) => {
        if (!result) throw new Error('🤬 Cannot find the user!')
    })
    return user
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
export const verifyAdmin = async (_email: string): Promise<boolean> => {
    const email = sanitize(_email)

    if (!(await isUserAdmin(email))) {
        throw new Error(`🤬 User is not admin: ${email}`)
    }
    return true
}
