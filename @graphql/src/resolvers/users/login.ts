import jwt from 'jsonwebtoken'
import sanitize from 'mongo-sanitize'
/* Models */
import Logger from '@src/utils/logger'
import { User } from '@src/schema/users'
/* Utils */
import { mysqlDisconnect } from '@src/utils/mysql'
import { isUserAdmin } from '@src/utils/mysql/isUserAdmin'
import { createHash } from '@sujin/share/utils/crypto'
import { getSecret } from '@src/utils/security'
/* T_Type */
import type {
    T_NextToken,
    T_Token,
    T_Token_Return,
    T_User,
} from '@sujin/lib/types'

/**
 * User Login
 * @param nextToken
 * @returns {T_Token_Return}
 */
export const login = async (nextToken: string): Promise<T_Token_Return> => {
    if (!nextToken) {
        Logger.error('🤬 Login: token is empty', nextToken)
        throw new Error('🤬 Login: token is empty')
    }

    // Get email from Next token
    const { email: _email } = jwt.verify(
        nextToken,
        getSecret('next'),
    ) as T_NextToken
    if (!_email) {
        throw new Error('🤬 Login: email is empty')
    }
    const email = sanitize(_email)
    const hashed = createHash(email, getSecret('email'))

    // Get MongoDB user._id
    const _id = await User.findOne<T_User>({ email: hashed }).then(
        async (result) => {
            if (result) {
                return result._id.toString()
            }

            // Create a new user
            const user = await User.insertOne<T_User>({ email: hashed })
            return user._id.toString()
        },
    )

    // Find the user is admin from MySQL
    const admin = await isUserAdmin(email)
    await mysqlDisconnect()

    const tokenContent: T_Token = {
        _id,
        email,
        admin,
    }

    const accessToken = jwt.sign(tokenContent, getSecret('gql'), {
        expiresIn: '1d',
    })
    Logger.info(`🤟 login has been finished: ${email}`)
    return {
        _id,
        accessToken,
    }
}
