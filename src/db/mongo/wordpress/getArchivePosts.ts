import { type WithId } from 'mongodb'
/* Models */
import { Cached } from '@common/model/Cached'
import Mongo from '@common/data/mongo/mongo'
/* Types */
import type { Post } from '@src/types/wordpress'
/* Constants */
import { TermTypes } from '@src/constants/wordpress'
import { PER_PAGE } from '@src/constants/mysql-query'
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
import { IS_DEV } from '@common/constants/helper'

/**
 * Request posts in the archive from MongoDB by type and slug
 * @param {string} slug - The slug of archive
 * @param {number} page - The page number
 * @returns {Promise<WithId<Post>[]>} - The archive posts
 */
const request = async (slug: string, page: number): Promise<WithId<Post>[]> =>
    await Mongo.findMany<Post>(
        'post',
        { 'categories.slug': slug },
        {
            sort: { date: -1 },
            limit: PER_PAGE,
            skip: PER_PAGE * (page - 1),
        },
    )

/**
 * Request posts in the archive by type and slug
 * This returns the cached result if it exists
 * @param {TermTypes} type - The type of archive
 * @param {string} _slug - The slug of archive
 * @param {number} page - The page number
 * @returns {Promise<WithId<Post>[]>} - The archive posts
 */
const getArchivePosts = async (
    type: TermTypes,
    _slug: string,
    page: number,
): Promise<WithId<Post>[]> => {
    const slug = _slug.toLowerCase()
    const key = `archive-${type}-${slug}-${page}`

    return await Cached.getInstance().getOrExecute(
        key,
        async () => await request(slug, page),
        WEEK_IN_SECONDS,
        IS_DEV,
    )
}

export default getArchivePosts
