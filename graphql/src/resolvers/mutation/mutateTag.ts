/* T_Types */
import type { MutationResultType } from '@src/types'
/* CONSTANTS */
import { ARCHIVE } from '@lib/types'
import { mutateArchive } from '@src/resolvers/mutation/mutateArchive'

type Param = {
    nonce: string
    slug: string
}

export const mutateTag = async (
    _: unknown,
    { slug }: Param,
): Promise<MutationResultType> => {
    return await mutateArchive(slug, ARCHIVE.TAG)
}
