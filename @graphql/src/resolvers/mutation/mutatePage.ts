import sanitize from 'mongo-sanitize'
/* T_Types */
import type { MutationResultType } from '@src/types'
import type { Context } from '@src/types'
/* Utils */
import { getCacheKey } from '@sujin/lib/utils/cache'
import { getPostBy } from '@src/utils/mysql/post'
import { convertWPImageURL } from '@src/utils/mongo/convertWPImageURL'
import { verifyAdmin } from '@src/utils/mongo/verifyUser'
import { mysqlDisconnect } from '@src/utils/mysql'
/* Models */
import Logger from '@src/utils/logger'
import Cached from '@sujin/node-cache'
import { Page } from '@src/schema/post'
/* CONSTANTS */
import { COLLECTION, POST_IMAGE_LOCATION, POST_TYPE } from '@sujin/lib/types'

type Param = {
    nonce: string
    slug: string
}

/**
 * Update Mongo Post type from MySQL for GraphQL
 *
 * @returns {Promise<MutationResultType>}
 */
export const mutatePage = async (
    _: unknown,
    { slug: _slug }: Param,
    context: Context,
): Promise<MutationResultType> => {
    if (!(await verifyAdmin(context.token))) {
        Logger.error(`⛈️ mutatePage mutation has been called by non admin user`)
        throw new Error(
            `⛈️ mutatePage mutation has been called by non admin user`,
        )
    }

    const slug = sanitize(_slug)
    const page = await getPostBy('slug', slug, POST_TYPE.PAGE)

    await Cached.getInstance().flush(getCacheKey(COLLECTION.PAGE, slug))
    await mysqlDisconnect()
    if (page.images) {
        Object.keys(page.images).forEach((key) => {
            const imageKey = key as POST_IMAGE_LOCATION
            page.images[imageKey] = convertWPImageURL(page.images[imageKey]!)
        })
    }

    await Page.findOneAndReplace({ slug }, page).then(async (result) => {
        if (!result) {
            await Page.insertOne(page)
        }
    })

    Logger.info(`🤟 mutatePage mutation has been finished: ${slug}`)
    return {
        result: true,
    }
}
