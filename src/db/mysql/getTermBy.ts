'use server'
/* Constants */
import { MySQLQuery } from '@src/constants/mysql-query'
import { TermTypes } from '@src/constants/wordpress'
/* Utils */
import { getTermMeta } from '@src/db/mysql/getTermMeta'
import { getMedia } from '@src/db/mysql/getMedia'
/* Models */
import { MySQL } from '@src/db/mysql'
import { Logger } from '@common/model/Logger'
/* Types */
import type { ArchiveProp, Term } from '@src/types/wordpress'

export const request = async (type: TermTypes, slug: string): Promise<Term> => {
    Logger.server(
        `Access MySQL for getting archive type: ${type} and slug: ${slug}.`,
    )

    const term = await MySQL.getInstance()
        .selectOne<Term>(MySQLQuery.getTermBy('slug', slug))
        .catch(() => {
            Logger.server(
                `Failed to get MySQL archive type: ${type} and slug: ${slug}.`,
            )
            throw new Error('Failed to get term.')
        })

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
