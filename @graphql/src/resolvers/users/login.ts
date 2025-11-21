import sanitize from 'mongo-sanitize'
/* Models */
import { Logger } from '@sujin/share/model/Logger'
import { User } from '@src/schema/users'
/* Utils */
import { mysqlDisconnect } from '@src/utils/mysql'
import { isUserAdmin } from '@src/utils/mysql/isUserAdmin'
import { createHash } from '@sujin/share/utils/crypto'
import { getSecret } from '@src/utils/security'
/* T_Type */
import type { T_User } from '@sujin/lib/types'

/**
 * Exchange a Next.js `nextToken` for an application GraphQL access token.
 *
 * - Verifies and decodes the incoming Next token to obtain an email address.
 * - Creates or finds a corresponding MongoDB user and checks MySQL for admin
 *   capability.
 * - Issues a signed GraphQL JWT containing `_id`, `email` and `admin` flag.
 *
 * @param nextToken - A JWT issued by NextAuth containing the user's email.
 * @returns An object containing the created user's `_id` and a new `accessToken`.
 * @throws {Error} When the incoming token is missing or invalid.
 */
export const login = async (_email: string): Promise<T_User> => {
    if (!_email) {
        throw new Error('🤬 Login: email is empty')
    }
    const email = sanitize(_email)
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

    Logger.info(`🤟 login has been finished: ${email}`)
    return result
}
