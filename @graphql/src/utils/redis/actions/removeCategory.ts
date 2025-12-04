import sanitize from 'mongo-sanitize'
/* Models */
import { Archive } from '@src/schema/archive'
import { Logger } from '@sujin/share/model/Logger'
/* Utils */
import { removeCache } from '@src/utils/redis/cache'
/* CONSTANTS */
import { ARCHIVE, COLLECTION } from '@sujin/lib/constants'

/**
 * Remove a category archive from MongoDB.
 *
 * @param slug - The category slug to remove.
 */
export const removeCategory = async (_slug: string): Promise<void> => {
    const slug = sanitize(_slug)
    await Archive.deleteOne({ slug, type: ARCHIVE.CATEGORY })
    removeCache(`${COLLECTION.ARCHIVE}-${ARCHIVE.CATEGORY}-${slug}`)
    Logger.info(`⭐️ removeCategory done: ${slug}`)
}
