'use server'
import { MySQLQuery, PER_PAGE } from '@src/constants/mysql-query'
import { MySQL } from '@src/db/mysql'
import { TermTypes } from '@src/constants/wordpress'
import { getTermMeta } from '@src/db/mysql/getTermMeta'
import { getMedia } from '@src/db/mysql/getMedia'
import { getPostsBy } from '@src/db/mysql/getPostsBy'
import { Logger } from '@common/model/Logger'
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
import { Cached } from '@common/model/Cached'
import { IS_DEV } from '@src/constants/system'
import type { Term } from '@src/types/wordpress'

export const request = async (
    type: TermTypes,
    slug: string,
    page: number,
): Promise<Term> => {
    Logger.server(
        `Access MySQL for getting archive type: ${type}, slug: ${slug}, and page: ${page}.`,
    )

    const term = await MySQL.getInstance().selectOne<Term>(
        MySQLQuery.getTermBy('slug', slug),
    )

    if (!term.total) {
        throw Error(
            `Failed to find term type: ${type}, slug: ${slug}, and page: ${page}.`,
        )
    }

    const pages = Math.ceil(term.total / PER_PAGE)
    const image = await getTermMeta<{ value: string }>(
        term.id,
        'thumbnail',
    ).then(async (data) =>
        data && data.value ? await getMedia(parseInt(data.value)) : undefined,
    )
    const posts = await getPostsBy(type, slug, page)

    return {
        ...term,
        type: TermTypes[term.type as keyof typeof TermTypes],
        limit: PER_PAGE,
        pages,
        image,
        posts,
        page,
    }
}

export const getTermBy = async (
    type: TermTypes,
    _slug: string,
    page: number,
) => {
    const slug = _slug.toLowerCase()
    const key = `archive-${type}-${slug}-${page}`
    return await Cached.getInstance().getOrExecute(
        key,
        async () => await request(type, slug, page),
        WEEK_IN_SECONDS,
        IS_DEV,
    )
}
