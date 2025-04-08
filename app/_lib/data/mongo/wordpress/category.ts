/* Types */
import type { MutationResultType } from '@app/api/graphql/constants'
import { ARCHIVE, T_Category } from '@app/_lib/types'
/* Utils */
import {
    getCachedArchive,
    updateArchive,
    mutateArchive,
    getArchives,
    removeArchive,
    categoryFormatter,
} from '@app/_lib/data/mongo/wordpress/archive'

export const getCachedCategory = async (slug: string): Promise<T_Category> =>
    await getCachedArchive(slug, ARCHIVE.CATEGORY, categoryFormatter)

export const updateCategory = async (slug: string): Promise<T_Category> =>
    await updateArchive(slug, ARCHIVE.CATEGORY, categoryFormatter)

export const mutateCategory = async (
    nonce: string,
    slug: string,
): Promise<MutationResultType> =>
    await mutateArchive(nonce, slug, ARCHIVE.CATEGORY, categoryFormatter)

export const getCategories = async (page: number = 1) =>
    await getArchives(page, ARCHIVE.CATEGORY, categoryFormatter)

export const removeCategory = async (slug: string) =>
    await removeArchive(slug, ARCHIVE.CATEGORY)
