/* Models */
import { Archive } from '@src/schema/archive'
import { Logger } from '@sujin/share/model/Logger'
/* Utils */
import { removeCache } from '@src/utils/redis/cache'
import { getCategory } from '@src/utils/wordpress/category'
/* CONSTANTS */
import { ARCHIVE, COLLECTION } from '@sujin/lib/constants'
import type { T_Archive } from '@sujin/lib/types'

/**
 * Refresh a WordPress category archive in the MongoDB `Archive` collection.
 *
 * @param slug - WordPress term slug identifying the category to refresh.
 */
export const updateCategory = async (slug: string): Promise<T_Archive> => {
    const wp = await getCategory(slug)
    const mongo: Partial<T_Archive> = {
        title: wp.name,
        slug: wp.slug,
        type: ARCHIVE.CATEGORY,
        excerpt: wp.description,
        image: wp.thumbnail,
        total: wp.count,
    }

    const category = await Archive.findOneAndReplace<T_Archive>({ slug }, mongo).then(async (result) => {
        if (!result) {
            return await Archive.insertOne(mongo)
        }
        return result
    })

    removeCache(`${COLLECTION.ARCHIVE}-${ARCHIVE.CATEGORY}-${slug}`)
    Logger.info(`⭐️ Update category done: ${slug}`)
    return category as T_Archive
}
