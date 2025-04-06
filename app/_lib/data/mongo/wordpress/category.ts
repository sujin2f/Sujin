/* Types */
import { ARCHIVE, type CategoryType } from '@app/_lib/data/mysql/types'
import type { MutationResultType } from '@app/api/graphql/constants'
/* Utils */
import {
    getCachedArchive,
    updateArchive,
    secureUpdateArchive,
    getArchives,
    removeArchive,
} from '@app/_lib/data/mongo/wordpress/archive'

export const getCachedCategory = async (slug: string): Promise<CategoryType> =>
    await getCachedArchive<CategoryType>(slug, ARCHIVE.CATEGORY)

export const updateCategory = async (slug: string): Promise<CategoryType> =>
    await updateArchive<CategoryType>(slug, ARCHIVE.CATEGORY)

export const mutateCategory = async (
    nonce: string,
    slug: string,
): Promise<MutationResultType> =>
    await secureUpdateArchive(nonce, slug, ARCHIVE.CATEGORY)

export const getCategories = async (page: number = 1) =>
    await getArchives<CategoryType>(page, ARCHIVE.CATEGORY)

export const removeCategory = async (slug: string) =>
    await removeArchive(slug, ARCHIVE.CATEGORY)
