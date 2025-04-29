import sanitize from 'mongo-sanitize'
import type { ObjectId } from 'mongodb'
/* Models */
import Cached from '@common/model/Cached'
/* Utils */
import { getPostsBy } from '@app/_lib/data/mysql/post'
import { getCacheKey } from '@app/_lib/utils/cache'
import { auth } from '@app/_lib/data/mongo/user'
import { updateTotal } from '@app/admin/_lib/updateTotal'
import { updateMongoFromMySQL } from '@app/admin/_lib/update-post'
/* CONSTANTS */
import { ARCHIVE, COLLECTION, POST_TYPE } from '@app/_lib/types'

export const updateArchivePosts = async (
    _type: ARCHIVE,
    _slug: string,
    page: number,
) => {
    const type = sanitize(_type)
    const slug = sanitize(_slug)
    await auth()
    Cached.getInstance().flush(getCacheKey(COLLECTION.POST))
    Cached.getInstance().flush(getCacheKey(COLLECTION.ARCHIVE, type, slug))

    await getPostsBy(type, POST_TYPE.POST, slug, page, true).then(
        async (result) => {
            const archives: ObjectId[] = []
            for (const item of result) {
                archives.push(...(await updateMongoFromMySQL(item)))
            }
            await updateTotal(archives)
        },
    )
}
