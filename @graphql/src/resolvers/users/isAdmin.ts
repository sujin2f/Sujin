/* Utils */
import Logger from '@src/utils/logger'
import { verifyToken } from '@src/utils/security'

/**
 * Check the user is admin
 * @param gqlToken
 * @returns
 */
export const isAdmin = (gqlToken: string): boolean => {
    if (!gqlToken) {
        throw new Error()
    }
    const { admin } = verifyToken(gqlToken)
    Logger.info(`🤟 isAdmin has been finished`)
    return admin
}
