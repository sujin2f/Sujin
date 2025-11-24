import mongoose from 'mongoose'
/* Models */
import { Logger } from '@sujin/share/model/Logger'
/* Utils */
import { verifyAccessToken } from '@src/utils/security'

/**
 * Mutation that flushes selected MongoDB collections. Requires an admin
 *
 * @param token - Admin JWT token used to authorize the operation.
 * @returns `true` when operation completes.
 * @throws {Error} When the caller is not an admin.
 */
export const flushDB = async (token: string): Promise<boolean> => {
    const payload = await verifyAccessToken(token)
    if (!payload.sub.admin) {
        throw new Error('🤬 flushDB mutation has been called by non admin user')
    }

    // Object.keys(mongoose.connection.collections).

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
