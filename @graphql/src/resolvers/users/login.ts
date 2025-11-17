import sanitize from 'mongo-sanitize'
/* Models */
import Logger from '@src/utils/logger'
import { mysqlDisconnect } from '@src/utils/mysql'
import { User } from '@src/schema/users'
/* Utils */
import { isUserAdmin } from '@src/utils/mysql/isUserAdmin'
import { createHash } from '@sujin/share/utils/crypto'
import { createToken, getSecret } from '@src/utils/security'
/* T_Type */
import type { T_Token, T_User } from '@sujin/lib/types'

/**
 * User Login
 *
 * @param _email
 * @returns
 */
export const login = async (_email: string): Promise<Partial<T_Token>> => {
    // secure email
    const email = createHash(sanitize(_email), getSecret())
    const user: T_Token = await User.findOne<T_User>({ email }).then(
        async (result) => {
            if (result) {
                return {
                    _id: result._id.toString(),
                    admin: result.admin,
                } satisfies T_Token
            }

            // Find the user is admin from MySQL
            const admin = await isUserAdmin(email)
            await mysqlDisconnect()

            // Create a new user
            const user = await User.insertOne<T_User>({ email, admin })

            return {
                _id: user._id.toString(),
                admin: !!user.admin,
            } satisfies T_Token
        },
    )
    const token = createToken(user)

    Logger.info(`🤟 login has been finished: ${email},  ${user._id}`)
    return {
        _id: user._id,
        token,
    } satisfies Partial<T_Token>
}
