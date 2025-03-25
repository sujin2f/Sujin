'use server'
import { MySQLQuery } from '@src/constants/mysql-query'
import { MySQL } from '@src/db/mysql'
import { TermTypes } from '@src/constants/wordpress'
import { getTermMeta } from '@src/db/mysql/getTermMeta'
import { getMedia } from '@src/db/mysql/getMedia'
import { Logger } from '@common/model/Logger'
import type { ArchiveProp, Term } from '@src/types/wordpress'

export const request = async (type: TermTypes, slug: string): Promise<Term> => {
    Logger.server(
        `Access MySQL for getting archive type: ${type} and slug: ${slug}.`,
    )

    const term = await MySQL.getInstance().selectOne<Term>(
        MySQLQuery.getTermBy('slug', slug),
    )

    const image = await getTermImage(term)

    return {
        ...term,
        type: TermTypes[term.type as keyof typeof TermTypes],
        image,
    }
}

export const getTermBySlug = async (props: ArchiveProp) => {
    const slug = props.slug.toLowerCase()
    return await request(props.type, slug)
}

export const getTermById = async (termId: number) => {
    const term = await MySQL.getInstance().selectOne<Term>(
        MySQLQuery.getTermBy('id', termId.toString()),
    )
    const image = await getTermImage(term)
    return {
        ...term,
        type: TermTypes[term.type as keyof typeof TermTypes],
        image,
    }
}

const getTermImage = async (term: Term) =>
    await getTermMeta<{ value: string }>(term.id, 'thumbnail')
        .then(async (data) =>
            data && data.value
                ? await getMedia(parseInt(data.value))
                : undefined,
        )
        .catch(() => undefined)
