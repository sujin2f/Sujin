import jwt from 'jsonwebtoken'
/* Modules */
import Logger from '@src/utils/logger'
import { User } from '@src/schema/user'
/* T_Types */
import type { T_User } from '@sujin/lib/types'

export const verifyToken = async (token: string): Promise<T_User> => {
    const failed = { _id: '', email: '', admin: false }

    if (!process.env.JWT_SECRET) {
        return failed
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as T_User
        return await User.findOne<T_User>({
            _id: decoded._id,
            admin: decoded.admin,
        })
            .then((result) => {
                if (!result) {
                    return failed
                }
                return result
            })
            .catch(() => {
                return failed
            })
    } catch (error) {
        Logger.error(`Invalid token: ${error}`)
    }

    return failed
}
