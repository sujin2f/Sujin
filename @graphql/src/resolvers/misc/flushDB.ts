import mongoose from 'mongoose'
/* Models */
import Logger from '@src/utils/logger'
/* Utils */
import { verifyAdmin } from '@src/utils/security'

export const flushDB = async (token: string): Promise<boolean> => {
    verifyAdmin(token, 'flushDB mutation has been called by non admin user')

    // TODO Flush more / use COLLECTION
    if (mongoose.connection.collections.spectra) {
        await mongoose.connection.dropCollection('spectra')
    }
    // if (mongoose.connection.collections.posts) {
    //     await mongoose.connection.dropCollection('posts')
    // }

    Logger.info(`🤟 flushDB mutation has been finished`)
    return true
}
