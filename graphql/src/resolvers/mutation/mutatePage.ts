import sanitize from 'mongo-sanitize'
/* T_Types */
import type { MutationResultType } from '@src/types'
/* Utils */
import { getCacheKey } from '@lib/utils/cache'
import { getPostBy } from '@src/utils/mysql/getPostBy'
/* Models */
import Cached from '@common/model/Cached'
/* CONSTANTS */
import { COLLECTION, POST_IMAGE_LOCATION, POST_TYPE } from '@lib/types'
import { convertImageBlockURL } from '@src/utils/mongo/convertImageBlockURL'
import { Page } from '@src/schema/post'

/**
 * Update Mongo Page type from MySQL
 * This is also directly used from Admin
 *
 * @param {string} _slug - Page slug
 * @returns {Promise<void>}
 */
const updatePage = async (_slug: string): Promise<void> => {
    const slug = sanitize(_slug)
    await Cached.getInstance().flush(getCacheKey(COLLECTION.PAGE, slug))

    const page = await getPostBy('slug', slug, POST_TYPE.PAGE)
    if (page.images) {
        Object.keys(page.images).forEach((key) => {
            const imageKey = key as POST_IMAGE_LOCATION
            page.images[imageKey] = convertImageBlockURL(page.images[imageKey]!)
        })
    }

    await Page.findOneAndReplace({ slug }, page).then(async (result) => {
        if (!result) {
            await Page.insertOne(page)
        }
    })
}

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
    { slug }: Param,
): Promise<MutationResultType> => {
    await updatePage(slug)
    return {
        result: true,
    }
}
