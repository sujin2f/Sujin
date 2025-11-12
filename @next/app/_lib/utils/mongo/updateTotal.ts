import { ObjectId } from 'mongodb'
/* CONSTANTS */
import { COLLECTION, POST_STATUS } from '@app/_lib/types'
/* Utils */
import { getCollection } from '@sujin/common/data/mongo/mongo'

export const updateTotal = async (_ids: ObjectId[]) => {
    const post = await getCollection(COLLECTION.POST)
    const archive = await getCollection(COLLECTION.ARCHIVE)

    for (const _id of Array.from(new Set(_ids))) {
        const total = await post.countDocuments({
            archives: new ObjectId(_id),
            status: POST_STATUS.PUBLISH,
        })
        await archive.updateOne({ _id }, { $set: { total } })
    }
}
