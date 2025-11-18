import { backgrounds as getBackgrounds } from '@src/resolvers/wordpress/backgrounds/backgrounds'
import { refreshBackgrounds } from '@src/resolvers/wordpress/backgrounds/refreshBackgrounds'

import type { T_Context } from '@src/types'

export const backgrounds = {
    Query: {
        backgrounds: getBackgrounds,
    },
    Mutation: {
        refreshBackgrounds: async (
            _: unknown,
            __: unknown,
            context: T_Context,
        ) => await refreshBackgrounds(context.token),
    },
}
