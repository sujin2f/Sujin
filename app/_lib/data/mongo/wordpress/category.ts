/* Types */
import { ARCHIVE, type ArchiveType } from '@app/_lib/types/wordpress'
import type { MutationResultType } from '@app/api/graphql/constants'
/* Utils */
import {
    getCachedArchive,
    updateArchiveTotal,
    updateArchive,
    secureUpdateArchive,
    getArchives,
    removeArchive,
} from '@app/_lib/data/mongo/wordpress/archive'

export const getCachedCategory = async (
    slug: string,
    updateFromMySQL: boolean = false,
): Promise<ArchiveType> =>
    await getCachedArchive(slug, ARCHIVE.CATEGORY, updateFromMySQL)

export const updateCategoryTotal = async (slug: string): Promise<ArchiveType> =>
    await updateArchiveTotal(slug, ARCHIVE.CATEGORY)

export const updateCategory = async (slug: string): Promise<ArchiveType> =>
    await updateArchive(slug, ARCHIVE.CATEGORY)

export const secureUpdateCategory = async (
    nonce: string,
    slug: string,
): Promise<MutationResultType> =>
    await secureUpdateArchive(nonce, slug, ARCHIVE.CATEGORY)

export const getCategories = async (page: number = 1) =>
    await getArchives(page, ARCHIVE.CATEGORY)

export const removeCategory = async (slug: string) =>
    await removeArchive(slug, ARCHIVE.CATEGORY)
