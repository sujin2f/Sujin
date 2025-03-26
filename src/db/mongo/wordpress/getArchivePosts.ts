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
/* Utils */
import { isDev } from '@common/utils/system'

const request = async (
    type: TermTypes,
    slug: string,
    page: number,
): Promise<WithId<Post>[]> =>
    await Mongo.findMany<Post>(
        'post',
        { 'categories.slug': slug },
        {
            sort: { date: -1 },
            limit: PER_PAGE,
            skip: PER_PAGE * (page - 1),
        },
    )

export const getArchivePosts = async (
    type: TermTypes,
    _slug: string,
    page: number,
): Promise<WithId<Post>[]> => {
    const slug = _slug.toLowerCase()
    const key = `archive-${type}-${slug}-${page}`

    return await Cached.getInstance().getOrExecute(
        key,
        async () => await request(type, slug, page),
        WEEK_IN_SECONDS,
        isDev,
    )
}
