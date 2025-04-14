/* T_Types */
import type { MutationResultType } from '@app/api/graphql/constants'
import { ARCHIVE, type T_Category, type T_PostArchive } from '@app/_lib/types'
/* Utils */
import {
    updateArchive,
    mutateArchive,
    getArchives,
    removeArchive,
} from '@app/_lib/data/mongo/wordpress/archive'
import { schemaFormatter } from '@common/utils/object'
/* CONSTANTS */
import { default as schema } from '@app/_lib/data/mongo/schema/10.3.2'

export const formatter = (term: Record<string, unknown>): T_Category => {
    const formatted = schemaFormatter(term, schema.category) as T_Category
    if (term.page) {
        formatted.page = term.page as number
    }
    if (term.posts && Array.isArray(term.posts)) {
        formatted.posts = term.posts.map(
            (post) =>
                schemaFormatter(post, schema.archivePost) as T_PostArchive,
        )
    }
    return formatted
}

export const updateCategory = async (slug: string): Promise<T_Category> =>
    await updateArchive(slug, ARCHIVE.CATEGORY, formatter)

export const mutateCategory = async (
    nonce: string,
    slug: string,
): Promise<MutationResultType> =>
    await mutateArchive(nonce, slug, ARCHIVE.CATEGORY, formatter)

export const getCategories = async (page: number = 1) =>
    await getArchives(page, ARCHIVE.CATEGORY)

export const removeCategory = async (slug: string) =>
    await removeArchive(slug, ARCHIVE.CATEGORY)
