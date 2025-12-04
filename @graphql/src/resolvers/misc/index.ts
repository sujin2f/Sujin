import { flickr } from '@src/resolvers/misc/flickr'
import { spectrum } from '@src/resolvers/misc/spectrum'

import type { T_GQL_Params_Spectrum } from '@sujin/lib/types'

/**
 * Miscellaneous resolvers that don 't belong to a single feature domain.
 *
 * Exports a `misc` object containing `Query` and `Mutation` resolvers used by
 * the root resolver map.
 */
export const misc = {
    Query: {
        flickr,
        spectrum: async (_: unknown, { number, ion }: T_GQL_Params_Spectrum) => await spectrum(number, ion),
    },
}
