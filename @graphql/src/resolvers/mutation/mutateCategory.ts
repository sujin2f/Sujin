/* T_Types */
import type { MutationResultType } from '@src/types'
/* CONSTANTS */
import { ARCHIVE } from '@sujin/lib/types'
/* Utils */
import { mutateArchive } from '@src/resolvers/mutation/mutateArchive'

type Param = {
    nonce: string
    slug: string
}

export const mutateCategory = async (
    _: unknown,
    { slug }: Param,
): Promise<MutationResultType> => {
    const result = await mutateArchive(slug, ARCHIVE.CATEGORY)
    return result
}
