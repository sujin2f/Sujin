/* Utils */
import Logger from '@src/utils/logger'
import { verifyToken } from '@src/utils/security'

/**
 * Determine whether the provided GraphQL token belongs to an administrator.
 *
 * @param gqlToken - The GraphQL JWT issued by this application.
 * @returns `true` when the decoded token contains a truthy `admin` flag.
 * @throws {Error} When the token is missing or invalid.
 */
export const isAdmin = (gqlToken: string): boolean => {
    if (!gqlToken) {
        throw new Error()
    }
    const { admin } = verifyToken(gqlToken)
    Logger.info(`🤟 isAdmin has been finished`)
    return admin
}
