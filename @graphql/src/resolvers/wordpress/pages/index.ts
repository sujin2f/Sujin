import { page } from '@src/resolvers/wordpress/pages/page'
import { pages as getPages } from '@src/resolvers/wordpress/pages/pages'
import { refreshPage } from '@src/resolvers/wordpress/pages/refreshPage'
import { removePage } from '@src/resolvers/wordpress/pages/removePage'

import type { T_Context } from '@src/types'
import type { T_GQL_Params_Page, T_GQL_Params_Slug } from '@sujin/lib/types'

/**
 * Page-related GraphQL resolvers.
 *
 * Exposes `page` and paginated `pages` queries plus mutations to refresh or
 * remove pages. Some operations are admin-protected.
 */
export const pages = {
    Query: {
        page: async (_: unknown, { slug }: T_GQL_Params_Slug) =>
            await page(slug),
        pages: async (
            _: unknown,
            { page }: T_GQL_Params_Page,
            context: T_Context,
        ) => await getPages(page, context.token),
    },
    Mutation: {
        refreshPage: async (
            _: unknown,
            { slug }: T_GQL_Params_Slug,
            context: T_Context,
        ) => await refreshPage(slug, context.token),
        removePage: async (
            _: unknown,
            { slug }: T_GQL_Params_Slug,
            context: T_Context,
        ) => await removePage(slug, context.token),
    },
}
