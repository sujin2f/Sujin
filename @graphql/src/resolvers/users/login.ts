import jwt from 'jsonwebtoken'
import sanitize from 'mongo-sanitize'
/* Models */
import { Logger } from '@sujin/share/model/Logger'
import { User } from '@src/schema/users'
/* Utils */
import { mysqlDisconnect } from '@src/utils/mysql'
import { isUserAdmin } from '@src/utils/mysql/isUserAdmin'
import { createHash } from '@sujin/share/utils/crypto'
import { createRefreshToken, getSecret } from '@src/utils/security'
import { verifyLoginToken } from '@sujin/lib/utils/token'
/* T_Type */
import type { T_GoogleUser, T_Login_Token, T_User } from '@sujin/lib/types'
import type { Response } from '@src/types'
import { HEADER_TOKEN } from '@sujin/lib/constants'

/**
 * Exchange a Next.js `nextToken` for an application GraphQL access token.
 *
 * - Verifies and decodes the incoming Next token to obtain an email address.
 * - Creates or finds a corresponding MongoDB user and checks MySQL for admin
 *   capability.
 * - Issues a signed GraphQL JWT containing `_id`, `email` and `admin` flag.
 *
 * // TODO check the request is from @auth
 *
 * @param {T_GoogleUser} user - A JWT issued by NextAuth containing the user's email.
 * @param {string} token - temp token
 * @param {Response} res - Response from express.
 * @returns {T_User}
 * @throws {Error} When the incoming token is missing or invalid.
 */
export const login = async (user: T_GoogleUser, token: string, res: Response): Promise<T_User> => {
    const email = sanitize(user.email)
    if (!email) {
        Logger.error('🤬 Login: email is empty')
        throw new Error('🤬 Login: email is empty')
    }
    const payload = jwt.verify(token, getSecret('access')) as T_Login_Token
    const origin = JSON.parse(`${process.env.CORS_ORIGINS}`) as string[]
    try {
        verifyLoginToken(payload, origin)
    } catch (e: unknown) {
        Logger.error((e as Error).message)
        throw e
    }

    const hashed = createHash(email, getSecret('email'))
    const _id = await User.findOne<T_User>({ email: hashed }).then(async (result) => {
        if (result) {
            return result._id.toString()
        }
        // Create a new user
        const user = await User.insertOne<T_User>({ email: hashed })
        return user._id.toString()
    })

    // Find the user is admin from MySQL
    const admin = await isUserAdmin(email)
    await mysqlDisconnect()

    const result: T_User = {
        _id,
        admin,
    }

    // Refresh Token
    const refreshToken = createRefreshToken({ ...user, ...result })
    res.setHeader(HEADER_TOKEN, `Bearer ${refreshToken}`)

    Logger.info(`🤟 login has been finished: ${JSON.stringify(result)}`)
    return result
}
