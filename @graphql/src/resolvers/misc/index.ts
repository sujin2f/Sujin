import { flickr } from '@src/resolvers/misc/flickr'
import { flushDB } from '@src/resolvers/misc/flushDB'
import { spectra } from '@src/resolvers/misc/spectra'

import type { Context } from '@src/types'

type Param = {
    number: number
    ion: number
}

export const misc = {
    Query: {
        flickr,
        spectra: async (_: unknown, { number, ion }: Param) =>
            await spectra(number, ion),
    },
    Mutation: {
        flushDB: async (_: unknown, __: unknown, context: Context) =>
            await flushDB(context),
    },
}
