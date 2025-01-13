'use server'

import { Nullable } from '@common/types'
import { MySQLQuery, PER_PAGE } from '@src/constants/mysql-query'
import { MySQL } from '@src/db/mysql'
import { Term, TermTypes } from '@src/types/wordpress'
import { getTermMeta } from '@src/db/mysql/getTermMeta'
import { getMedia } from '@src/db/mysql/getMedia'
import { getPostsBy } from '@src/db/mysql/getPostsBy'
import { unstable_cache } from 'next/cache'

export const request = async (
    type: TermTypes,
    slug: string,
    page: number,
): Promise<Nullable<Term>> => {
    const term = await MySQL.getInstance().selectOne<Term>(
        MySQLQuery.getTermBy('slug', slug),
    )

    if (!term) {
        return
    }
    if (!term.id) {
        return
    }

    const pages = Math.ceil(term.total / PER_PAGE)
    const image = await getTermMeta<{ value: string }>(
        term.id,
        'thumbnail',
    ).then(async (data) =>
        data ? await getMedia(parseInt(data.value)) : undefined,
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

const cachedRequest = async (type: TermTypes, slug: string, page: number) => {
    return unstable_cache(
        async () => await request(type, slug, page),
        ['term', type, slug, page.toString()],
    )
}

export const getTermBy = async (
    type: TermTypes,
    slug: string,
    page: number,
) => {
    return (await (
        await cachedRequest(type, slug, page)
    )()) as Term
}
