/* Utils */
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
    return admin
}
