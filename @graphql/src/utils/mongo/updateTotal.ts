import { Types } from 'mongoose'
/* CONSTANTS */
import { COLLECTION, POST_STATUS } from '@sujin/lib/constants'
/* Utils */
import { getCacheKey } from '@sujin/lib/utils/cache'
/* Models */
import { Post } from '@src/schema/post'
import { Archive } from '@src/schema/archive'
import Cached from '@sujin/share/model/Cache'

/**
 * Recalculate and update the total number of published posts for the given
 * archive object ids.
 *
 * - Deduplicates the provided ids.
 * - Counts published posts linked to each archive and updates the archive's
 *   `total` field accordingly.
 * - Flushes the tag-cloud cache key after updates.
 *
 * @param _ids - Array of archive `ObjectId`s to update.
 */
export const updateTotal = async (_ids: Types.ObjectId[]): Promise<void> => {
    for (const _id of Array.from(new Set(_ids))) {
        const total = await Post.countDocuments({
            archives: new Types.ObjectId(_id),
            status: POST_STATUS.PUBLISH,
        })
        await Archive.updateOne({ _id }, { $set: { total } })
    }

    await Cached.getInstance().flush(
        getCacheKey(COLLECTION.ARCHIVE, 'tag-cloud'),
    )
}
