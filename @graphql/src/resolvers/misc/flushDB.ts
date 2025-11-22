import mongoose from 'mongoose'
/* Models */
import { Logger } from '@sujin/share/model/Logger'
/* Utils */
import { verifyAdmin } from '@src/utils/security'

/**
 * Mutation that flushes selected MongoDB collections. Requires an admin
 * token — `verifyAdmin` is used to guard the operation.
 *
 * @param token - Admin JWT token used to authorize the operation.
 * @returns `true` when operation completes.
 * @throws {Error} When the caller is not an admin (via `verifyAdmin`).
 */
export const flushDB = async (token: string): Promise<boolean> => {
    await verifyAdmin(token, 'flushDB mutation has been called by non admin user')

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
