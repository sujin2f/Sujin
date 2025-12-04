/* Models */
import { Logger } from '@sujin/share/model/Logger'
/* CONSTANTS */
import { COLLECTION, POST_TYPE } from '@sujin/lib/constants'
/* Utils */
import { getPostBy } from '@src/utils/mysql/post'
import { updatePost as updateMongoPost } from '@src/utils/mongo/updatePost'
import { updateTotal } from '@src/utils/mongo/updateTotal'
import { mysqlDisconnect } from '@src/utils/mysql'
import { removeCache } from '@src/utils/redis/cache'

/**
 * Refresh a single post from MySQL into MongoDB.
 *
 * @param slug - Post slug to refresh.
 */
export const updatePost = async (slug: string): Promise<void> => {
    await getPostBy('slug', slug, POST_TYPE.POST, true).then(async (post) => {
        const archives = await updateMongoPost(post)
        await updateTotal(archives)
    })
    await mysqlDisconnect()

    await removeCache(COLLECTION.POST, 'archive')
    await removeCache(COLLECTION.POST, slug)

    Logger.info(`⭐️ updatePost done: ${slug}`)
}
