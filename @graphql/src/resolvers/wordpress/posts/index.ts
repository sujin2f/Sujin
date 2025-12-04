import { post } from '@src/resolvers/wordpress/posts/post'
import { posts as getPosts } from '@src/resolvers/wordpress/posts/posts'
import { postsAdmin } from '@src/resolvers/wordpress/posts/postsAdmin'
import { postsAllAdmin } from '@src/resolvers/wordpress/posts/postsAllAdmin'
import { prevNext } from '@src/resolvers/wordpress/posts/prevNext'
import { recent } from '@src/resolvers/wordpress/posts/recent'
import { related } from '@src/resolvers/wordpress/posts/related'
import { search } from '@src/resolvers/wordpress/posts/search'

import type { Context } from '@src/types'
import type { T_GQL_Params_Page, T_GQL_Params_Posts, T_GQL_Params_Slug } from '@sujin/lib/types'

/**
 * WordPress posts resolvers.
 *
 * Provides queries for fetching single posts, lists, admin-only lists and
 * search-related operations, plus mutations to refresh posts from the
 * upstream WordPress source.
 */
export const posts = {
    Query: {
        post: async (_: unknown, { slug }: T_GQL_Params_Slug) => await post(slug),
        posts: async (_: unknown, { type, slug, page }: T_GQL_Params_Posts) => await getPosts(type, slug, page),
        postsAdmin: async (_: unknown, { slug, page }: T_GQL_Params_Slug & T_GQL_Params_Page, context: Context) =>
            await postsAdmin(slug, page, context.token),
        postsAllAdmin: async (_: unknown, { page }: T_GQL_Params_Page, context: Context) =>
            await postsAllAdmin(page, context.token),
        search: async (_: unknown, { keyword, page }: T_GQL_Params_Page & { keyword: string }) =>
            await search(keyword, page),

        recent,
        prevNext: async (_: unknown, { slug }: T_GQL_Params_Slug) => await prevNext(slug),
        related: async (_: unknown, { slug }: T_GQL_Params_Slug) => await related(slug),
    },
}
