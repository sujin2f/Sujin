import sanitize from 'mongo-sanitize'
/* Models */
import { Logger } from '@sujin/share/model/Logger'
import { User } from '@src/schema/users'
/* Utils */
import { mysqlDisconnect } from '@src/utils/mysql'
import { isUserAdmin } from '@src/utils/mysql/isUserAdmin'
import { createHash } from '@sujin/share/utils/crypto'
import { getTokenSub, generateToken } from '@sujin/lib/utils/token'
/* T_Type */
import type { T_GoogleUser, T_User } from '@sujin/lib/types'
import type { Response } from '@src/types'
import { ACCESS_TOKEN_LIFETIME, HEADER_TOKEN, REFRESH_TOKEN_LIFETIME } from '@sujin/lib/constants'

const ACCESS_SECRET = `${process.env.ACCESS_SECRET}`
const REFRESH_SECRET = `${process.env.REFRESH_SECRET}`
const EMAIL_SECRET = `${process.env.EMAIL_SECRET}`
const INTER_COM_SECRET = `${process.env.INTER_COM_SECRET}`
const CRYPTO_KEY = `${process.env.CRYPTO_KEY}`

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
export const login = async (googleUser: T_GoogleUser, token: string, res: Response): Promise<boolean> => {
    Logger.info(`🤞 login has been finished`)
    const email = sanitize(googleUser.email)
    if (!email) {
        Logger.error('🤬 Login: email is empty')
        throw new Error('🤬 Login: email is empty')
    }

    // verify token
    const sub = await getTokenSub<T_GoogleUser>(token, CRYPTO_KEY)
    if (sub.email !== email) {
        throw new Error(`🤬 The request is malformed ${sub.email} ${email}`)
    }

    const hashed = createHash(email, EMAIL_SECRET)
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

    const mongoUser: T_User = {
        _id,
        admin,
    }

    // Tokens
    const refreshToken = await generateToken(
        { ...googleUser, ...mongoUser },
        REFRESH_TOKEN_LIFETIME,
        REFRESH_SECRET,
        CRYPTO_KEY,
    )
    const accessToken = await generateToken(
        { ...googleUser, ...mongoUser },
        ACCESS_TOKEN_LIFETIME,
        ACCESS_SECRET,
        CRYPTO_KEY,
    )
    const commToken = await generateToken(
        { user: { ...googleUser, ...mongoUser }, refreshToken, accessToken },
        15,
        INTER_COM_SECRET,
        CRYPTO_KEY,
    )

    res.setHeader(HEADER_TOKEN, `Bearer ${commToken}`)

    Logger.info(`🤞 login has been finished: ${JSON.stringify(mongoUser)}`)
    return true
}
