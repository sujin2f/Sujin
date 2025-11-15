import jwt from 'jsonwebtoken'
import sanitize from 'mongo-sanitize'
import mongoose from 'mongoose'
/* Models */
import Logger from '@src/utils/logger'
import { mysqlDisconnect } from '@src/utils/mysql'
import { User } from '@src/schema/user'
/* Utils */
import { isUserAdmin } from '@src/utils/mysql/isUserAdmin'
import { createHash } from '@sujin/share/utils/crypto'
import { verifyAdmin } from '@src/utils/mongo/verifyUser'
/* CONSTANTS */
/* T_Type */
import type { T_User } from '@sujin/lib/types'
import type { Context } from '@src/types'

export const flushDB = async (context: Context): Promise<boolean> => {
    verifyAdmin(
        context.token,
        'flushDB mutation has been called by non admin user',
    )

    // TODO Flush more / use COLLECTION
    if (mongoose.connection.collections.spectra) {
        await mongoose.connection.dropCollection('spectra')
    }

    Logger.info(`🤟 flushDB mutation has been finished`)
    return true
}

export const login = async (_email: string) => {
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
