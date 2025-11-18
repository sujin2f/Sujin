import { Types } from 'mongoose'
import sanitize from 'mongo-sanitize'
/* Models */
import Logger from '@src/utils/logger'
import Cached from '@sujin/node-cache'
/* CONSTANTS */
import { POST_TYPE, COLLECTION } from '@sujin/lib/constants'
/* Utils */
import { getCacheKey } from '@sujin/lib/utils/cache'
import { verifyAdmin } from '@src/utils/security'
import { getPosts } from '@src/utils/mysql/post'
import { updatePost as updateMongoPost } from '@src/utils/mongo/updatePost'
import { updateTotal } from '@src/utils/mongo/updateTotal'
import { mysqlDisconnect } from '@src/utils/mysql'

export const refreshPostsAll = async (
    _page: number,
    token: string,
): Promise<boolean[]> => {
    verifyAdmin(
        token,
        'refreshPostsAll mutation has been called by non admin user',
    )
    const page = sanitize(_page)

    await getPosts(POST_TYPE.POST, page).then(async (result) => {
        const archives: Types.ObjectId[] = []
        for (const item of result) {
            archives.push(...(await updateMongoPost(item)))
        }
        await updateTotal(archives)
    })
    await mysqlDisconnect()

    await Cached.getInstance().flush(getCacheKey(COLLECTION.POST))
    Logger.info(`🤟 refreshPostsAll mutation done: ${page}`)
    return []
}
