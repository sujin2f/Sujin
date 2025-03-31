'use server'
/* Constants */
import { MySQLQuery } from '@src/constants/mysql-query'
import { TermTypes } from '@src/constants/wordpress'
/* Utils */
import { getTermMeta } from '@src/db/mysql/getTermMeta'
import { getMedia } from '@src/db/mysql/getMedia'
/* Models */
import MySQL from '@src/db/mysql'
import Logger from '@common/model/Logger'
/* Types */
import type { ArchiveProp, Term } from '@src/types/wordpress'
import type { Image } from '@src/types/wordpress'

/**
 * Get term image.
 * @param {Term} term Term.
 * @return {Promise<Image | undefined>} Image.
 */
const getTermImage = async (term: Term): Promise<Image | undefined> =>
    await getTermMeta<{ value: string }>(term.id, 'thumbnail')
        .then(async (data) =>
            data && data.value
                ? await getMedia(parseInt(data.value))
                : undefined,
        )
        .catch(() => undefined)

/**
 * Get term by slug.
 * @param {ArchiveProp} props Archive properties.
 * @return {Promise<Term>} Term.
 * @throws {Error} Failed to get term.
 */
export const getTermBySlug = async (props: ArchiveProp): Promise<Term> => {
    const slug = props.slug.toLowerCase()
    Logger.server(
        `Access MySQL for getting archive type: ${props.type} and slug: ${slug}.`,
    )

    const term = await MySQL.getInstance()
        .selectOne<Term>(MySQLQuery.getTermBy('slug', slug))
        .catch(() => {
            Logger.server(
                `Failed to get MySQL archive type: ${props.type} and slug: ${slug}.`,
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

/**
 * Get term by ID.
 * @param {number} termId Term ID.
 * @return {Promise<Term>} Term.
 * @throws {Error} Failed to get term.
 */
export const getTermById = async (termId: number): Promise<Term> => {
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
