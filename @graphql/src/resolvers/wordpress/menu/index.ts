import { menu } from '@src/resolvers/wordpress/menu/menu'

import type { T_GQL_Params_Slug } from '@sujin/lib/types'

/**
 * WordPress menu resolvers.
 */
export const menus = {
    Query: {
        menu: async (_: unknown, { slug }: T_GQL_Params_Slug) => await menu(slug),
    },
}
