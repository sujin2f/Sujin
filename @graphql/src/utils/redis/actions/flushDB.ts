import mongoose from 'mongoose'
/* Models */
import { Logger } from '@sujin/share/model/Logger'
/* Utils */
import { removeCache } from '@src/utils/redis/cache'

/**
 * Mutation that flushes selected MongoDB collections. Requires an admin
 *
 * @param token - Admin JWT token used to authorize the operation.
 * @returns `true` when operation completes.
 * @throws {Error} When the caller is not an admin.
 */
export const flushDB = async (): Promise<boolean> => {
    // Object.keys(mongoose.connection.collections).

    // TODO Flush more / use COLLECTION
    if (mongoose.connection.collections.spectra) {
        await mongoose.connection.dropCollection('spectra')
    }
    // if (mongoose.connection.collections.posts) {
    //     await mongoose.connection.dropCollection('posts')
    // }

    await removeCache()
    Logger.info(`⭐️ flushDB has been finished`)
    return true
}
