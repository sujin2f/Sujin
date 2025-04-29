import sanitize from 'mongo-sanitize'
/* Models */
import Cached from '@common/model/Cached'
/* CONSTANTS */
import { ARCHIVE, COLLECTION, type T_Archive } from '@app/_lib/types'
/* Utils */
import { getCacheKey } from '@app/_lib/utils/cache'
import { auth } from '@app/_lib/data/mongo/user'
import { getCollection } from '@common/data/mongo/mongo'

export const removeArchive = async (_slug: string, _type: ARCHIVE) => {
    const slug = sanitize(_slug)
    const type = sanitize(_type)

    await auth()
    await Cached.getInstance().flush(
        getCacheKey(COLLECTION.ARCHIVE, type, slug),
    )
    const collection = await getCollection<T_Archive>(COLLECTION.ARCHIVE)
    return await collection.deleteOne({ slug, type })
}
