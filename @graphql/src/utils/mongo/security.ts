import jwt from 'jsonwebtoken'
import { Types } from 'mongoose'
/* Modules */
import Logger from '@src/utils/logger'
import { User } from '@src/schema/users'
/* T_Types */
import type { T_Token, T_User } from '@sujin/lib/types'
import type { Nullable } from '@sujin/share/types'

export const createToken = (user: T_Token): string => {
    const secret = getSecret()
    return jwt.sign(user, secret, { expiresIn: '1h' })
}

/**
 * Verify given token from MongoDB user
 *
 * @param token
 * @returns {Promise<Nullable<T_User>>}
 * @throws
 */
export const verifyToken = async (token: string): Promise<Nullable<T_User>> => {
    if (!token) {
        return
    }

    const secret = getSecret()

    try {
        const { _id, admin } = jwt.verify(token, secret) as T_Token
        return await User.findOne<T_User>({
            _id: new Types.ObjectId(_id),
            admin,
        })
    } catch (e) {
        Logger.error(`🤬 Invalid token: ${e}`)
        throw e
    }

    return
}

/**
 * Verify given token is admin
 *
 * @param token
 * @returns
 * @throws
 */
export const verifyAdmin = async (
    token: string,
    message: string,
): Promise<void> => {
    const user = await verifyToken(token)
    if (!user || !user.admin) {
        Logger.error(`🤬 ${message}`)
        throw new Error(`🤬 ${message}`)
    }
}

export const getSecret = (): string => {
    const secret = process.env.JWT_SECRET
    if (!secret) {
        // TODO
        throw new Error()
    }
    return secret
}
