import { flickr } from '@src/resolvers/misc/flickr'
import { flushDB } from '@src/resolvers/misc/flushDB'
import { spectrum } from '@src/resolvers/misc/spectrum'

import type { T_Context } from '@src/types'
import type { T_GQL_Params_Spectrum } from '@sujin/lib/types'

export const misc = {
    Query: {
        flickr,
        spectrum: async (_: unknown, { number, ion }: T_GQL_Params_Spectrum) =>
            await spectrum(number, ion),
    },
    Mutation: {
        flushDB: async (_: unknown, __: unknown, context: T_Context) => {
            await flushDB(context.token)
        },
    },
}
