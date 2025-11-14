import jwt from 'jsonwebtoken'
import sanitize from 'mongo-sanitize'
/* Models */
import Logger from '@src/utils/logger'
import { mysqlDisconnect } from '@src/utils/mysql'
import { User } from '@src/schema/user'
/* Utils */
import { isUserAdmin } from '@src/utils/mysql/isUserAdmin'
import { createHash } from '@sujin/share/utils/crypto'
/* CONSTANTS */
import type { T_User } from '@sujin/lib/types'

type Param = {
    email: string
}

export const login = async (_: unknown, { email: _email }: Param) => {
    // secure email
    const email = sanitize(_email)
    const emailHash = createHash(email, process.env.CRYPT_JWK || '')

    const user = await User.findOne<T_User>({ email: emailHash }).then(
        async (result) => {
            if (!result) {
                const admin = await isUserAdmin(email)
                await mysqlDisconnect()
                const user = (
                    await User.insertOne<T_User>({ email: emailHash, admin })
                ).toObject()
                return {
                    _id: user._id,
                    email: user.email,
                    admin: user.admin,
                }
            }
            return result
        },
    )

    const token = jwt.sign(
        { _id: user._id, admin: user.admin },
        `${process.env.JWT_SECRET}`,
        {
            expiresIn: '1h',
        },
    )

    Logger.info(`🤟 login mutation has been finished: ${_email}`)
    return token
}
