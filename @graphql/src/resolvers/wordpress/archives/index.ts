import { tagCloud } from '@src/resolvers/wordpress/archives/tagCloud'
import { category } from '@src/resolvers/wordpress/archives/category'
import { categories } from '@src/resolvers/wordpress/archives/categories'
import { tag } from '@src/resolvers/wordpress/archives/tag'
import { tags } from '@src/resolvers/wordpress/archives/tags'

import type { T_Context } from '@src/types'
import type { T_GQL_Params_Page, T_GQL_Params_Slug } from '@sujin/lib/types'

/**
 * Archive-related resolver group    (categories & tags).
 *
 * Exposes queries for tag cloud, individual category/tag lookups and paginated
 * listing as well as mutations to update hits, refresh and remove categories.
 */
export const archives = {
    Query: {
        tagCloud,
        category: async (_: unknown, { slug }: T_GQL_Params_Slug) => await category(slug),
        categories: async (_: unknown, { page }: T_GQL_Params_Page, context: T_Context) =>
            await categories(page, context.token),
        tag: async (_: unknown, { slug }: T_GQL_Params_Slug) => await tag(slug),
        tags: async (_: unknown, { page }: T_GQL_Params_Page, context: T_Context) => await tags(page, context.token),
    },
}
