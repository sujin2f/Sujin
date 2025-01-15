'use server'

import { MySQLQuery, PER_PAGE } from '@src/constants/mysql-query'
import { MySQL } from '@src/db/mysql'
import { Term, TermTypes } from '@src/types/wordpress'
import { getTermMeta } from '@src/db/mysql/getTermMeta'
import { getMedia } from '@src/db/mysql/getMedia'
import { getPostsBy } from '@src/db/mysql/getPostsBy'
import { unstable_cache } from 'next/cache'
import { DAY_IN_SECONDS } from '@common/constants/datetime'

export const request = async (
    type: TermTypes,
    slug: string,
    page: number,
): Promise<Term> => {
    const term = await MySQL.getInstance().selectOne<Term>(
        MySQLQuery.getTermBy('slug', slug),
    )

    if (!term || !term.id) {
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
        async () =>
            await request(type, slug, page)
                .then((result) => result)
                .catch((e) => {
                    throw new Error(e.message)
                }),
        ['term', type, slug, page.toString()],
        { revalidate: DAY_IN_SECONDS },
    )
}

export const getTermBy = async (type: TermTypes, slug: string, page: number) =>
    await (
        await cachedRequest(type, slug, page)
    )()
