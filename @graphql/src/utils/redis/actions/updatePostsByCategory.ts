import { Types } from 'mongoose'
/* Models */
import { Logger } from '@sujin/share/model/Logger'
/* CONSTANTS */
import { ARCHIVE, COLLECTION, POST_TYPE } from '@sujin/lib/constants'
/* Utils */
import { getPostsBy } from '@src/utils/mysql/post'
import { updatePost as updateMongoPost } from '@src/utils/mongo/updatePost'
import { updateTotal } from '@src/utils/mongo/updateTotal'
import { mysqlDisconnect } from '@src/utils/mysql'
import { removeCache } from '../cache'

/**
 * Refresh a page of posts for a given category (`slug`) by fetching them
 * from MySQL and upserting into MongoDB.
 *
 * @param slug - Category slug whose posts should be refreshed.
 * @param page - 1-based page number to fetch from MySQL.
 */
export const updatePostsByCategory = async (slug: string, page: number): Promise<void> => {
    // TODO WP Rest
    await getPostsBy(ARCHIVE.CATEGORY, POST_TYPE.POST, slug, page, true).then(async (result) => {
        const archives: Types.ObjectId[] = []
        for (const item of result) {
            archives.push(...(await updateMongoPost(item)))
        }
        await updateTotal(archives)
    })
    await mysqlDisconnect()
    await removeCache(COLLECTION.POST)

    Logger.info(`⭐️ updatePostsByCategory done: ${slug}`)
}
