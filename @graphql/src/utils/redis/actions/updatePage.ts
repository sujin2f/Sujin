/* Models */
import { Logger } from '@common/model/Logger'
import { Page } from '@src/schema/post'
/* CONSTANTS */
import { POST_TYPE, POST_IMAGE_LOCATION, COLLECTION } from '@common/constants'
import { DAY_IN_MS } from '@common/constants/datetime'
/* Utils */
import { getPostBy } from '@src/utils/mysql/post'
import { mysqlDisconnect } from '@src/utils/mysql'
import { convertWPImageURL } from '@src/utils/mongo/convertWPImageURL'
import { removeCache } from '@src/utils/redis/cache'

/**
 * Refresh a page by fetching the latest content from MySQL and updating the
 * MongoDB `Page` document.
 *
 * @param slug - The slug of the page to refresh.
 */
export const updatePage = async (slug: string): Promise<void> => {
    // TODO WP Rest
    const wpPage = await getPostBy('slug', slug, POST_TYPE.PAGE)
    const date = Math.trunc(wpPage.date.getTime() / DAY_IN_MS)

    await mysqlDisconnect()
    if (wpPage.images) {
        Object.keys(wpPage.images).forEach((key) => {
            const imageKey = key as POST_IMAGE_LOCATION
            wpPage.images[imageKey] = convertWPImageURL(wpPage.images[imageKey]!)
        })
    }

    await Page.findOneAndReplace({ slug }, { ...wpPage, date }).then(async (result) => {
        if (!result) {
            await Page.insertOne({ ...wpPage, date })
        }
    })

    removeCache(`${COLLECTION.PAGE}-${slug}`)
    Logger.info(`⭐️ updatePage done: ${slug}`)
}
