import jwt from 'jsonwebtoken'
import sanitize from 'mongo-sanitize'
/* Models */
import Logger from '@src/utils/logger'
import { mysqlDisconnect } from '@src/utils/mysql'
/* CONSTANTS */
import { T_User } from '@sujin/lib/types'
import { User } from '@src/schema/user'
import { isUserAdmin } from '@src/utils/mysql/isUserAdmin'

type Param = {
    email: string
}

export const login = async (_: unknown, { email: _email }: Param) => {
    Logger.info(`🤟 login mutation has been requested: ${_email}`)
    const email = sanitize(_email)
    const user = await User.findOne<T_User>({ email }).then(async (result) => {
        if (!result) {
            const admin = await isUserAdmin(email)
            await mysqlDisconnect()
            return (
                await User.insertOne<T_User>({ email, admin })
            ).toObject() as T_User
        }
        return result
    })

    const token = jwt.sign(
        { email: user.email, admin: user.admin },
        `${process.env.JWT_SECRET}`,
        {
            expiresIn: '1h',
        },
    )

    Logger.info(`🤟 login mutation has been finished`)
    return token
}
