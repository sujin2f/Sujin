import type { WithId } from 'mongodb'
/* Models */
import Cached from '@common/model/Cached'
/* CONSTANTS */
import { IS_DEV } from '@common/constants/helper'
import {
    COLLECTION,
    POST_IMAGE_LOCATION,
    POST_TYPE,
    T_Page,
} from '@app/_lib/types'
import { PER_PAGE } from '@app/_lib/data/mysql/constants'
import { default as schema } from '@app/_lib/data/mongo/schema/10.3.2'
import { DAY_IN_SECONDS } from '@common/constants/datetime'
import { ERROR_MESSAGE, ServerError } from '@app/_lib/constants-error'
/* Utils */
import { getCacheKey } from '@app/_lib/utils'
import { getPostBy } from '@app/_lib/data/mysql/post'
import { convertImageBlockURL } from '@app/_lib/data/mysql/utils'
import { drop_id, schemaFormatter } from '@common/utils/object'
import { auth } from '@app/_lib/utils-server'
import { getCollection, insertOrReplace } from '@common/data/mongo/mongo'
/* T_Types */
import type { MutationResultType } from '@app/api/graphql/constants'

const format = (page: WithId<T_Page> | T_Page): T_Page =>
    schemaFormatter(page, schema.page) as T_Page

/**
 * Update Mongo Post type from MySQL for GraphQL
 *
 * @param {string} nonce - WP nonce
 * @param {string} slug - Post slug
 * @returns {Promise<MutationResultType>}
 */
export const mutatePage = async (
    nonce: string,
    slug: string,
): Promise<MutationResultType> => {
    await updatePage(slug, nonce)
    return {
        result: true,
    }
}

/**
 * Get single page by slug
 * This returns the cached result if it exists
 *
 * @param {string} slug - Post slug
 * @returns {Promise<T_Page>} - The post object
 * @throws {Error} - MySQL page cannot be found
 */
export const getCachedPage = async (slug: string): Promise<T_Page> =>
    await Cached.getInstance().getOrExecute(
        getCacheKey(COLLECTION.PAGE, slug),
        async () => {
            const collection = await getCollection<T_Page>(COLLECTION.PAGE)
            return await collection.findOne({ slug }).then((post) => {
                if (post) return drop_id(post)
                throw new ServerError(ERROR_MESSAGE.PAGE.GET_ONE, slug)
            })
        },
        DAY_IN_SECONDS,
        IS_DEV,
    )

/**
 * Update Mongo Page type from MySQL
 * This is also directly used from Admin
 *
 * @param {string} slug - Page slug
 * @returns {Promise<T_Page>}
 * @throws {Error} - MySQL page cannot be found
 */
export const updatePage = async (
    slug: string,
    nonce?: string,
): Promise<T_Page> => {
    await auth(nonce, slug)
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
    return page
}

/**
 * Admin get Pages by pagination
 *
 * @param {number} page - Page
 * @returns {Promise<T_Page[]>}
 */
export const getPages = async (page: number = 1): Promise<T_Page[]> => {
    const collection = await getCollection<T_Page>(COLLECTION.PAGE)
    return await collection
        .find({})
        .sort({ date: -1 })
        .limit(PER_PAGE)
        .skip(PER_PAGE * (page - 1))
        .project<T_Page>({ _id: -1 })
        .toArray()
}

/**
 * Admin remove page
 *
 * @param {string} slug - slug
 * @returns {Promise<void>}
 */
export const removePage = async (slug: string): Promise<void> => {
    await auth()
    await Cached.getInstance().flush(getCacheKey(COLLECTION.PAGE, slug))
    const collection = await getCollection<T_Page>(COLLECTION.PAGE)
    await collection.deleteOne({ slug })
}
