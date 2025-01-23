'use server'

import { Nullable } from '@common/types'
import { MySQLQuery, PER_PAGE } from '@src/constants/mysql-query'
import { MySQL } from '@src/db/mysql'
import { Term, TermTypes } from '@src/types/wordpress'
import { getTermMeta } from '@src/db/mysql/getTermMeta'
import { getMedia } from '@src/db/mysql/getMedia'
import { getPostsBy } from '@src/db/mysql/getPostsBy'
import { Error } from '@common/model/Error'

export const getTermBy = async (
    type: TermTypes,
    slug: string,
    page: number,
): Promise<Nullable<Term>> => {
    const term = await MySQL.getInstance().selectOne<Term>(
        MySQLQuery.getTermBy('slug', slug),
    )

    if (!term || !term.id) {
        throw new Error(`Term ${slug} does not exist.`, { level: 'error' })
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
