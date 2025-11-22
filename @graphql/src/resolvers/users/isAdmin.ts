/* Utils */
import { Logger } from '@sujin/share/model/Logger'
import { verifyAccessToken } from '@src/utils/security'

/**
 * Determine whether the provided GraphQL token belongs to an administrator.
 *
 * @param gqlToken - The GraphQL JWT issued by this application.
 * @returns `true` when the decoded token contains a truthy `admin` flag.
 * @throws {Error} When the token is missing or invalid.
 */
export const isAdmin = async (token: string): Promise<boolean> => {
    const payload = await verifyAccessToken(token)
    if (!payload.sub.admin) {
        throw new Error('🤬 The user is not admin!')
    }

    Logger.info(`🤟 isAdmin has been finished`)
    return true
}
