import type { WithId } from 'mongodb'
/* Models */
import Cached from '@common/model/Cached'
import Mongo from '@common/data/mongo/mongo'
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
/* Utils */
import { getCacheKey } from '@app/_lib/utils'
import { getPostBy } from '@app/_lib/data/mysql/post'
import { convertImageBlockURL } from '@app/_lib/data/mysql/utils'
import { schemaFormatter } from '@common/utils/object'
import { auth } from '@app/_lib/utils-server'
/* Types */
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
        async () =>
            await Mongo.findOne<T_Page>(COLLECTION.PAGE, { slug }).then(
                (page) => format(page),
            ),
        0,
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
    await auth(POST_TYPE.PAGE, nonce, slug)
    await Cached.getInstance().flush(getCacheKey(COLLECTION.PAGE, slug))

    const result = await getPostBy('slug', slug, POST_TYPE.PAGE)
    const page = format(result)
    if (page.images) {
        Object.keys(page.images).forEach((key) => {
            const imageKey = key as POST_IMAGE_LOCATION
            page.images[imageKey] = convertImageBlockURL(page.images[imageKey]!)
        })
    }
    await Mongo.insertOrReplace(COLLECTION.PAGE, { slug }, page)
    return page
}

/**
 * Admin get Pages by pagination
 *
 * @param {number} page - Page
 * @returns {Promise<T_Page[]>}
 */
export const getPages = async (page: number = 1): Promise<T_Page[]> =>
    await Mongo.findMany<T_Page>(
        COLLECTION.PAGE,
        {},
        { sort: { date: -1 }, limit: PER_PAGE, skip: PER_PAGE * (page - 1) },
    ).then((result) => result.map((page) => format(page)))

/**
 * Admin remove page
 *
 * @param {string} slug - slug
 * @returns {Promise<void>}
 */
export const removePage = async (slug: string): Promise<void> => {
    await auth()
    await Cached.getInstance().flush(getCacheKey(COLLECTION.PAGE, slug))
    await Mongo.deleteOne(COLLECTION.PAGE, { slug })
}
