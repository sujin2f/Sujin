import sanitize from 'mongo-sanitize'
/* Models */
import Logger from '@src/utils/logger'
import { Page } from '@src/schema/post'
import Cached from '@sujin/node-cache'
/* CONSTANTS */
import {
    POST_TYPE,
    POST_IMAGE_LOCATION,
    COLLECTION,
} from '@sujin/lib/constants'
import { DAY_IN_MS } from '@sujin/share/constants/datetime'
/* Utils */
import { getCacheKey } from '@sujin/lib/utils/cache'
import { verifyAdmin } from '@src/utils/security'
import { getPostBy } from '@src/utils/mysql/post'
import { mysqlDisconnect } from '@src/utils/mysql'
import { convertWPImageURL } from '@src/utils/mongo/convertWPImageURL'

export const refreshPage = async (
    _slug: string,
    token: string,
): Promise<boolean[]> => {
    verifyAdmin(
        token,
        'refreshPage mutation query has been called by non admin user',
    )
    const slug = sanitize(_slug)

    const wpPage = await getPostBy('slug', slug, POST_TYPE.PAGE)
    const date = Math.trunc(wpPage.date.getTime() / DAY_IN_MS)

    await Cached.getInstance().flush(getCacheKey(COLLECTION.PAGE, slug))
    await mysqlDisconnect()
    if (wpPage.images) {
        Object.keys(wpPage.images).forEach((key) => {
            const imageKey = key as POST_IMAGE_LOCATION
            wpPage.images[imageKey] = convertWPImageURL(
                wpPage.images[imageKey]!,
            )
        })
    }

    await Page.findOneAndReplace({ slug }, { ...wpPage, date }).then(
        async (result) => {
            if (!result) {
                await Page.insertOne({ ...wpPage, date })
            }
        },
    )

    await Cached.getInstance().flush(getCacheKey(COLLECTION.PAGE, slug))
    Logger.info(`🤟 refreshPage mutation done: ${slug}`)
    return []
}
