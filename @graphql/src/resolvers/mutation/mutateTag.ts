/* T_Types */
import type { MutationResultType } from '@src/types'
import type { Context } from '@src/types'
/* CONSTANTS */
import { ARCHIVE } from '@sujin/lib/types'
import { mutateArchive } from '@src/resolvers/mutation/mutateArchive'

type Param = {
    nonce: string
    slug: string
}

export const mutateTag = async (
    _: unknown,
    { slug }: Param,
    context: Context,
): Promise<MutationResultType> => {
    return await mutateArchive(slug, ARCHIVE.TAG, context)
}
