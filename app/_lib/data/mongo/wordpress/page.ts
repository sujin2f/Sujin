import type { Filter, WithId } from 'mongodb'
/* Models */
import Cached from '@common/model/Cached'
import Mongo from '@common/data/mongo/mongo'
/* CONSTANTS */
// import { WEEK_IN_SECONDS } from '@common/constants/datetime'
import { IS_DEV } from '@common/constants/helper'
import { COLLECTION, POST_IMAGE_LOCATION, POST_TYPE } from '@app/_lib/types'
import { PER_PAGE } from '@app/_lib/data/mysql/constants'
/* Utils */
import { removeOption, getOption } from '@app/_lib/data/mysql/option'
import { getCacheKey } from '@app/_lib/utils'
import { getPostBy } from '@app/_lib/data/mysql/post'
import { convertImageBlockURL } from '@app/_lib/data/mysql/utils'
import { formatPostImage } from '@app/_lib/data/mongo/wordpress/util'
/* Types */
import { type PageType } from '@app/_lib/data/mysql/types'
import type { MutationResultType } from '@app/api/graphql/constants'
import { ERROR_MESSAGE, ServerError } from '@app/_lib/constants-error'

const format = (page: WithId<PageType> | PageType): PageType => ({
    id: page.id,
    slug: page.slug,
    title: page.title,
    excerpt: page.excerpt || '',
    content: page.content,
    date: page.date,
    images: formatPostImage(page.images),
    meta: page.meta,
    status: page.status,
    link: page.link,
})

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
    // Nonce validation
    const optionKey = `update_page_${nonce}`
    const nonceValue = await getOption(optionKey)
    await removeOption(optionKey)

    if (`${nonce}-${slug}` !== nonceValue) {
        throw new ServerError(
            ERROR_MESSAGE.GENERAL.NONCE_FAILED,
            'mutatePage()',
        )
    }

    await updatePage(slug)
    return {
        result: true,
    }
}

/**
 * Get single page by slug
 * This returns the cached result if it exists
 *
 * @param {string} slug - Post slug
 * @param {boolean} ignoreStatus - The flag to ignore status
 * @returns {Promise<Page>} - The post object
 * @throws {Error} - MySQL page cannot be found
 */
export const getCachedPage = async (slug: string): Promise<PageType> =>
    await Cached.getInstance().getOrExecute(
        getCacheKey(COLLECTION.PAGE, slug),
        async () => {
            const doc: Filter<PageType> = { slug }
            const page = await Mongo.findOne<PageType>(
                COLLECTION.PAGE,
                doc,
            ).catch(async () => await updatePage(slug))
            return format(page)
        },
        0,
        IS_DEV,
    )

/**
 * Update Mongo Page type from MySQL
 * This is also directly used from Admin
 *
 * @param {string} slug - Page slug
 * @returns {Promise<Page>}
 * @throws {Error} - MySQL page cannot be found
 */
export const updatePage = async (slug: string): Promise<PageType> => {
    // Remove Cache
    await Cached.getInstance().flush(getCacheKey(COLLECTION.PAGE, slug))

    const result = await getPostBy('slug', slug, POST_TYPE.PAGE)
    const page = format(result)
    Object.keys(page.images).forEach((key) => {
        const imageKey = key as POST_IMAGE_LOCATION
        page.images[imageKey] = convertImageBlockURL(page.images[imageKey]!)
    })
    await Mongo.insertOrReplace(COLLECTION.PAGE, { slug }, page)
    return page
}

/**
 * Admin get Pages by pagination
 *
 * @param {number} page - Page
 * @returns {Promise<Page[]>}
 */
export const getPages = async (page: number = 1): Promise<PageType[]> =>
    await Mongo.findMany<PageType>(
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
    await Cached.getInstance().flush(getCacheKey(COLLECTION.PAGE, slug))
    await Mongo.deleteOne(COLLECTION.PAGE, { slug })
}
