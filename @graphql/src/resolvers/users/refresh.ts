/* Utils */
import { refreshAccessToken } from '@src/utils/security'
/* T_Type */
import type { Response } from '@src/types'
/* CONSTANTS */
import { HEADER_TOKEN } from '@sujin/lib/constants'

/**
 * Verify refresh token and issue a new access token
 *
 * @param {string} token - Refresh token.
 * @throws {Error} When the incoming token is missing or invalid.
 */
export const refresh = async (token: string, res: Response): Promise<undefined> => {
    if (!token) {
        throw new Error()
    }
    const refresh = refreshAccessToken(token)
    res.setHeader(HEADER_TOKEN, refresh)
    return
}
