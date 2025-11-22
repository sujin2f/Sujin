/* Utils */
import { Logger } from '@sujin/share/model/Logger'
import { verifyAdmin } from '@src/utils/security'

/**
 * Determine whether the provided GraphQL token belongs to an administrator.
 *
 * @param gqlToken - The GraphQL JWT issued by this application.
 * @returns `true` when the decoded token contains a truthy `admin` flag.
 * @throws {Error} When the token is missing or invalid.
 */
export const isAdmin = async (gqlToken: string): Promise<boolean> => {
    if (!gqlToken) {
        throw new Error()
    }
    const admin = await verifyAdmin(gqlToken, '')
    Logger.info(`🤟 isAdmin has been finished`)
    return admin
}
