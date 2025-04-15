/* T_Types */
import type { MutationResultType } from '@app/api/graphql/constants'
import { ARCHIVE } from '@app/_lib/types'
/* Utils */
import { mutateArchive } from '@app/_lib/data/mongo/wordpress/archive'

export const mutateCategory = async (
    nonce: string,
    slug: string,
): Promise<MutationResultType> =>
    await mutateArchive(nonce, slug, ARCHIVE.CATEGORY)
