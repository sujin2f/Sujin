/* Models */
import { Logger } from '@sujin/share/model/Logger'
/* Utils */
import { generateToken, verifyToken } from '@sujin/lib/utils/token'
/* T_Type */
import type { Response } from '@src/types'
import type { T_UserSub } from '@sujin/lib/types'
/* CONSTANTS */
import { ACCESS_TOKEN_LIFETIME, HEADER_TOKEN } from '@sujin/lib/constants'
import { verifyAdmin } from '@src/utils/security'

const ACCESS_SECRET = `${process.env.ACCESS_SECRET}`
const REFRESH_SECRET = `${process.env.REFRESH_SECRET}`
const CRYPTO_KEY = `${process.env.CRYPTO_KEY}`

/**
 * Verify refresh token and issue a new access token
 *
 * @param {string} token - Refresh token.
 * @throws {Error} When the incoming token is missing or invalid.
 */
export const refresh = async (token: string, res: Response): Promise<boolean> => {
    if (!token) {
        throw new Error()
    }

    const user = await verifyToken<T_UserSub>(token, REFRESH_SECRET, CRYPTO_KEY)
    if (user.admin) {
        const isAdmin = await verifyAdmin(user.email)
        if (!isAdmin) {
            Logger.error('🤬 Malformed admin access: ', JSON.stringify(user))
        }
    }

    const accessToken = await generateToken(user, ACCESS_TOKEN_LIFETIME, ACCESS_SECRET, CRYPTO_KEY)
    res.setHeader(HEADER_TOKEN, `Bearer ${accessToken}`)
    Logger.info(`🤞 refresh token has been finished`)
    return true
}
