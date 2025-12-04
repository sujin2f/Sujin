/* Models */
import { Logger } from '@sujin/share/model/Logger'
import { Page } from '@src/schema/post'
/* Utils */
import { removeCache } from '@src/utils/redis/cache'
/* CONSTANTS */
import { COLLECTION } from '@sujin/lib/constants'

/**
 * Remove a page document. Requires an admin token.
 *
 * @param slug - The slug of the page to remove.
 */
export const removePage = async (slug: string): Promise<void> => {
    await Page.deleteOne({ slug })
    removeCache(`${COLLECTION.PAGE}-${slug}`)
    Logger.info(`⭐️ removePage done: ${slug}`)
}
