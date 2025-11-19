import { backgrounds as getBackgrounds } from '@src/resolvers/wordpress/backgrounds/backgrounds'
import { refreshBackgrounds } from '@src/resolvers/wordpress/backgrounds/refreshBackgrounds'

import type { T_Context } from '@src/types'

/**
 * Backgrounds resolver group.
 *
 * Exposes a `backgrounds` query and a `refreshBackgrounds` mutation which is
 * admin-protected.
 */
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
