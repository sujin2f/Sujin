/* Models */
import { Archive } from '@src/schema/archive'
import { Logger } from '@sujin/share/model/Logger'
/* Utils */
import { getTermBySlug } from '@src/utils/mysql/term'
import { mysqlDisconnect } from '@src/utils/mysql'
import { convertWPImageURL } from '@src/utils/mongo/convertWPImageURL'
import { updateTotal } from '@src/utils/mongo/updateTotal'
import { removeCache } from '@src/utils/redis/cache'
/* CONSTANTS */
import { ARCHIVE, COLLECTION } from '@sujin/lib/constants'

/**
 * Refresh a WordPress category archive in the MongoDB `Archive` collection.
 *
 * @param slug - WordPress term slug identifying the category to refresh.
 */
export const updateCategory = async (slug: string): Promise<void> => {
    const wp = await getTermBySlug(slug)
    await mysqlDisconnect()

    if (wp.image) {
        wp.image = convertWPImageURL(wp.image)
    }

    const archive = await Archive.findOneAndReplace({ slug }, { ...wp, type: ARCHIVE.CATEGORY }).then(
        async (result) => {
            if (!result) {
                return await Archive.insertOne({
                    ...wp,
                    type: ARCHIVE.CATEGORY,
                })
            }
            return result
        },
    )

    // TODO connect post-category
    await updateTotal([archive._id])
    removeCache(`${COLLECTION.ARCHIVE}-${ARCHIVE.CATEGORY}-${slug}`)
    Logger.info(`⭐️ Update category done: ${slug}`)
}
