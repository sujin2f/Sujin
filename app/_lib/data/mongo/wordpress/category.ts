/* T_Types */
import type { MutationResultType } from '@app/api/graphql/constants'
import { ARCHIVE } from '@app/_lib/types'
/* Utils */
import {
    updateArchive,
    mutateArchive,
    removeArchive,
} from '@app/_lib/data/mongo/wordpress/archive'

export const updateCategory = async (slug: string) =>
    await updateArchive(slug, ARCHIVE.CATEGORY)

export const mutateCategory = async (
    nonce: string,
    slug: string,
): Promise<MutationResultType> =>
    await mutateArchive(nonce, slug, ARCHIVE.CATEGORY)

export const removeCategory = async (slug: string) =>
    await removeArchive(slug, ARCHIVE.CATEGORY)
