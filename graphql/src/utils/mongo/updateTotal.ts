import { Types } from 'mongoose'
/* CONSTANTS */
import { POST_STATUS } from '@lib/types'
/* Utils */
import { Post } from '@src/schema/post'
import { Archive } from '@src/schema/archive'

export const updateTotal = async (_ids: Types.ObjectId[]) => {
    for (const _id of Array.from(new Set(_ids))) {
        const total = await Post.countDocuments({
            archives: new Types.ObjectId(_id),
            status: POST_STATUS.PUBLISH,
        })
        await Archive.updateOne({ _id }, { $set: { total } })
    }
}
