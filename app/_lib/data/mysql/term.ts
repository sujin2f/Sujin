'use server'
/* CONSTANTS */
import { MySQLQuery } from '@app/_lib/data/mysql/constants'
import { ARCHIVE } from '@app/_lib/types'
/* Utils */
import { getMedia } from '@app/_lib/data/mysql/media'
/* Models */
import MySQL from '@app/_lib/data/mysql'
import Logger from '@common/model/Logger'
/* Types */
import type { T_ImageBlock } from '@app/_lib/types'
import type { ArchiveType, TermType } from '@app/_lib/data/mysql/types'
import type { Nullable } from '@common/types'
import { ERROR_MESSAGE, ServerError } from '@app/_lib/constants-error'

const getMeta = async <T = string>(id: number, metaKey: string): Promise<T> =>
    await MySQL.getInstance().selectOne<T>(MySQLQuery.getTermMeta(id, metaKey))

export const getTermsByPost = async (id: number): Promise<TermType[]> =>
    await MySQL.getInstance().select<TermType>(MySQLQuery.getTaxonomies(id))

/**
 * Get archive image.
 * @param {Term} archive Term.
 * @return {Promise<Nullable<T_ImageBlock>>} Image.
 */
const getThumbnail = async (
    archive: ArchiveType,
): Promise<Nullable<T_ImageBlock>> =>
    await getMeta<{ value: string }>(archive.id, 'thumbnail')
        .then(async (data) =>
            data && data.value
                ? await getMedia(parseInt(data.value))
                : undefined,
        )
        .catch(() => undefined)

/**
 * Get archive by slug.
 *
 * @param {string} slug
 * @param {ARCHIVE} type
 * @return {Promise<ArchiveType>}
 * @throws {Error} Failed to get the archive.
 */
export const getArchiveBySlug = async (
    slug: string,
    type: ARCHIVE,
): Promise<ArchiveType> => {
    Logger.server(
        `Access MySQL for getting archive type: ${type} and slug: ${slug}.`,
    )

    const archive = await MySQL.getInstance()
        .selectOne<ArchiveType>(MySQLQuery.getArchiveBy('slug', slug))
        .catch(() => {
            throw new ServerError(
                ERROR_MESSAGE.ARCHIVE.SQL_GET_ONE,
                'getArchiveBySlug()',
                type,
                slug,
            )
        })

    const image = await getThumbnail(archive)

    return {
        ...archive,
        image,
    }
}
