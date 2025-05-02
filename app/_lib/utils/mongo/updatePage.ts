'use server'
import type { WithId } from 'mongodb'
import sanitize from 'mongo-sanitize'
/* Models */
import Cached from '@common/model/Cached'
/* CONSTANTS */
import {
    COLLECTION,
    POST_IMAGE_LOCATION,
    POST_TYPE,
    type T_Page,
} from '@app/_lib/types'
import { default as schema } from '@app/_lib/schema/10.3.4'
/* Utils */
import { getCacheKey } from '@app/_lib/utils/cache'
import { getPostBy } from '@app/_lib/utils/mysql/getPostBy'
import { convertImageBlockURL } from '@app/_lib/utils/clients'
import { schemaFormatter } from '@common/utils/object'
import { insertOrReplace } from '@common/data/mongo/mongo'

const format = (page: WithId<T_Page> | T_Page): T_Page =>
    schemaFormatter(page, schema.page) as T_Page

/**
 * Update Mongo Page type from MySQL
 * This is also directly used from Admin
 *
 * @param {string} _slug - Page slug
 * @returns {Promise<void>}
 */
export const updatePage = async (_slug: string): Promise<void> => {
    const slug = sanitize(_slug)
    await Cached.getInstance().flush(getCacheKey(COLLECTION.PAGE, slug))

    const result = await getPostBy('slug', slug, POST_TYPE.PAGE)
    const page = format(result)
    if (page.images) {
        Object.keys(page.images).forEach((key) => {
            const imageKey = key as POST_IMAGE_LOCATION
            page.images[imageKey] = convertImageBlockURL(page.images[imageKey]!)
        })
    }
    await insertOrReplace(COLLECTION.PAGE, { slug }, page)
}
