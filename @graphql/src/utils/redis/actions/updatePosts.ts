import { Types } from 'mongoose'
/* Models */
import { Logger } from '@common/model/Logger'
/* CONSTANTS */
import { COLLECTION, POST_TYPE } from '@common/constants'
/* Utils */
import { getPosts } from '@src/utils/mysql/post'
import { updatePost as updateMongoPost } from '@src/utils/mongo/updatePost'
import { updateTotal } from '@src/utils/mongo/updateTotal'
import { mysqlDisconnect } from '@src/utils/mysql'
import { removeCache } from '@src/utils/redis/cache'

/**
 * Refresh a page of all posts (no category filter) by pulling data from MySQL
 * and upserting into MongoDB.
 *
 * @param page - 1-based page number to fetch from MySQL.
 */
export const updatePosts = async (page: number): Promise<void> => {
    // TODO WP Rest
    await getPosts(POST_TYPE.POST, page).then(async (result) => {
        const archives: Types.ObjectId[] = []
        for (const item of result) {
            archives.push(...(await updateMongoPost(item)))
        }
        await updateTotal(archives)
    })
    await mysqlDisconnect()
    await removeCache(COLLECTION.POST)

    Logger.info(`⭐️ updatePosts done: ${page}`)
}
