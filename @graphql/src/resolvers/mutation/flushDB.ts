/* Models */
import Logger from '@src/utils/logger'
/* CONSTANTS */
import { verifyToken } from '@src/utils/mongo/verifyUser'
import mongoose from 'mongoose'

type Context = {
    token: string
}

export const flushDB = async (
    _: unknown,
    __: unknown,
    context: Context,
): Promise<boolean> => {
    if (!context.token) {
        Logger.error(`⛈️ flushDB mutation has been called with empty token`)
        return false
    }

    const user = await verifyToken(context.token)
    if (!user.admin) {
        Logger.error(
            `⛈️ flushDB mutation has been called by non admin user ${user.email}`,
        )
        return false
    }

    // TODO Flush more
    if (mongoose.connection.collections.spectra) {
        await mongoose.connection.dropCollection('spectra')
    }
    // await mongoose.connection.dropCollection('users')
    Logger.info(`🤟 flushDB mutation has been finished`)
    return true
}
