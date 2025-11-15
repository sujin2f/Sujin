/* T_Types */
import type { MutationResultType } from '@src/types'
import type { Context } from '@src/types'
/* CONSTANTS */
import { ARCHIVE } from '@sujin/lib/types'
/* Utils */
import { mutateArchive } from '@src/resolvers/mutation/mutateArchive'

type Param = {
    slug: string
}

export const mutateCategory = async (
    _: unknown,
    { slug }: Param,
    context: Context,
): Promise<MutationResultType> => {
    const result = await mutateArchive(slug, ARCHIVE.CATEGORY, context)
    return result
}
