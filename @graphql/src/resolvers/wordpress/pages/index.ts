import { page } from '@src/resolvers/wordpress/pages/page'
import type { T_GQL_Params_Slug } from '@sujin/lib/types'

/**
 * Page-related GraphQL resolvers.
 *
 * Exposes `page` and paginated `pages` queries plus mutations to refresh or
 * remove pages. Some operations are admin-protected.
 */
export const pages = {
    Query: {
        page: async (_: unknown, { slug }: T_GQL_Params_Slug) => await page(slug),
    },
}
