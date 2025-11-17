import { Types } from 'mongoose'
/* CONSTANTS */
import { COLLECTION, POST_STATUS } from '@sujin/lib/constants'
/* Utils */
import { getCacheKey } from '@sujin/lib/utils/cache'
/* Models */
import { Post } from '@src/schema/post'
import { Archive } from '@src/schema/archive'
import Cached from '@sujin/node-cache'

export const updateTotal = async (_ids: Types.ObjectId[]) => {
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
