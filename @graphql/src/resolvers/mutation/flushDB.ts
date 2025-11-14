/* Models */
import Logger from '@src/utils/logger'
/* CONSTANTS */
import { verifyAdmin } from '@src/utils/mongo/verifyUser'
import mongoose from 'mongoose'
/* T_Type */
import type { Context } from '@src/types'

export const flushDB = async (
    _: unknown,
    __: unknown,
    context: Context,
): Promise<boolean> => {
    if (!(await verifyAdmin(context.token))) {
        Logger.error(`⛈️ flushDB mutation has been called by non admin user`)
        throw new Error(`⛈️ flushDB mutation has been called by non admin user`)
    }

    // TODO Flush more
    if (mongoose.connection.collections.spectra) {
        await mongoose.connection.dropCollection('spectra')
    }
    // await mongoose.connection.dropCollection('users')
    Logger.info(`🤟 flushDB mutation has been finished`)
    return true
}
