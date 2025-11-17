import { prevNext } from '@src/resolvers/wordpress/posts/prevNext'
import { recent } from '@src/resolvers/wordpress/posts/recent'
import { related } from '@src/resolvers/wordpress/posts/related'
import { post } from '@src/resolvers/wordpress/posts/post'
import { posts as postsResolver } from '@src/resolvers/wordpress/posts/postsByCategory'
import { search } from '@src/resolvers/wordpress/posts/search'

import type { Context } from '@src/types'

type P_Slug = {
    slug: string
}
type P_Page = {
    page: number
}
type P_IsAdmin = {
    isAdmin?: boolean
}
type P_Post = P_Slug & P_IsAdmin
type P_PostsByCategory = P_Post & P_Page
type P_Search = P_IsAdmin &
    P_Page & {
        keyword: string
    }

export const posts = {
    Query: {
        post: async (_: unknown, { slug, isAdmin }: P_Post, context: Context) =>
            await post(slug, !!isAdmin, context.token),
        posts: async (
            _: unknown,
            { slug, page, isAdmin }: P_PostsByCategory,
            context: Context,
        ) => await postsResolver(slug, page, !!isAdmin, context.token), // TODO
        search: async (
            _: unknown,
            { keyword, page, isAdmin }: P_Search,
            context: Context,
        ) => await search(keyword, page, !!isAdmin, context.token),

        prevNext: async (_: unknown, { slug }: P_Slug) => await prevNext(slug),
        recent,
        related: async (_: unknown, { slug }: P_Slug) => await related(slug),
    },
    Mutation: {
        refreshPost: async () => {},
        refreshPosts: async () => {},
    },
}
