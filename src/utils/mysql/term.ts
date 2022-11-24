import { MySQLQuery, PER_PAGE } from 'src/constants/mysql-query'
import { Nullable } from 'src/types/common'
import { TermTypes } from 'src/types/wordpress'
import { Term } from 'src/types/wordpress'
import { MySQL } from 'src/utils/mysql/mysqld'
import { getMedia } from './media'
import { getPostsBy } from './posts'

const getTermMeta = async <T = string>(
    id: number,
    metaKey: string,
): Promise<Nullable<T>> => {
    return await MySQL.getInstance()
        .query<T>(MySQLQuery.getTermMeta(id, metaKey), [])
        .then((result) => (result.length ? result[0] : undefined))
}

export const getTaxonomies = async (postId: number): Promise<Term[]> => {
    const result = await MySQL.getInstance().query<Term>(
        MySQLQuery.getTaxonomies(postId),
        [],
    )

    return result.map((item) => ({
        ...item,
        type: TermTypes[item.type as keyof typeof TermTypes],
        page: 0,
    }))
}

export const getTermBy = async (
    type: TermTypes,
    slug: string,
    page: number,
): Promise<Nullable<Term>> => {
    const term: Nullable<Term> = await MySQL.getInstance()
        .query<Term>(MySQLQuery.getTermBy('slug', slug), [])
        .then((data) => (data.length ? data[0] : undefined))

    if (!term) {
        return
    }

    const pages = Math.ceil(term.total / PER_PAGE)
    const image = await getTermMeta<{ value: string }>(
        term.id,
        'thumbnail',
    ).then(async (data) =>
        data ? await getMedia(parseInt(data.value, 10)) : undefined,
    )

    return {
        ...term,
        type: TermTypes[term.type as keyof typeof TermTypes],
        limit: PER_PAGE,
        pages,
        image,
        posts: await getPostsBy(type, slug, page),
        page,
    }
}
