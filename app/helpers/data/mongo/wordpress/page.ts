import type { Filter, WithId } from 'mongodb'
/* Models */
import Cached from '@common/model/Cached'
import Mongo from '@common/data/mongo/mongo'
import Logger from '@common/model/Logger'
/* Constants */
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
import { IS_DEV } from '@common/constants/helper'
import { COLLECTION } from '@app/helpers/constants/mongo'
import { PER_PAGE } from '@app/helpers/constants/mysql-query'
/* Utils */
import { removeOption, getOption } from '@app/helpers/data/mysql/option'
import { getCacheKey } from '@app/helpers/utils/system'
import { getPostBy } from '@app/helpers/data/mysql/post'
import { convertImageBlockURL } from '@app/helpers/utils/wordpress'
/* Types */
import { type PageType } from '@app/helpers/types/wordpress'
import type { MutationResultType } from '@app/helpers/constants/graphql'

const format = (page: WithId<PageType> | PageType): PageType => ({
    id: page.id,
    slug: page.slug,
    title: page.title,
    excerpt: page.excerpt || '',
    content: page.content,
    date: page.date,
    images: page.images,
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
export const secureUpdatePage = async (
    nonce: string,
    slug: string,
): Promise<MutationResultType> => {
    // Nonce validation
    Logger.server('GQL Server updatePage: started.')
    const optionKey = `update_page_${nonce}`
    const nonceValue = await getOption(optionKey)
    await removeOption(optionKey)

    if (`${nonce}-${slug}` !== nonceValue) {
        const message = 'GQL Server updatePage: got invalid nonce.'
        Logger.server(message)
        throw Error(message)
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
export const getCachedPage = async (slug: string): Promise<PageType> => {
    const key = getCacheKey(COLLECTION.PAGE, slug)

    return await Cached.getInstance().getOrExecute(
        key,
        async () => {
            const doc: Filter<PageType> = { slug }
            const page = await Mongo.findOne<PageType>(
                COLLECTION.PAGE,
                doc,
            ).catch(async () => await updatePage(slug))
            return format(page)
        },
        WEEK_IN_SECONDS,
        IS_DEV,
    )
}

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

    return await getPostBy('slug', slug, 'page')
        .then(async (result) => {
            const page = format({
                ...result,
                link: `/${slug}`,
            })
            Object.keys(page.images).forEach((key) => {
                page.images[key] = convertImageBlockURL(page.images[key])
            })
            await removePage(slug)
            await Mongo.insertOne(COLLECTION.PAGE, page)
            Logger.server(`updatePage(): Updated MongoDB post: ${slug}`)
            return page
        })
        .catch(async () => {
            await removePage(slug)
            const message = `updatePage(): Failed to update MongoDB post: ${slug}`
            Logger.server(message)
            throw Error(message)
        })
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
    Logger.server(`Page removed ${slug}`)
}
