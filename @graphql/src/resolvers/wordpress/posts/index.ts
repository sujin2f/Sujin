import { prevNext } from '@src/resolvers/wordpress/posts/prevNext'
import { recent } from '@src/resolvers/wordpress/posts/recent'
import { related } from '@src/resolvers/wordpress/posts/related'
import { post } from '@src/resolvers/wordpress/posts/post'
import { postByCategory } from '@src/resolvers/wordpress/posts/postByCategory'
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
type P_PostByCategory = P_Post & P_Page
type P_Search = P_IsAdmin &
    P_Page & {
        keyword: string
    }

export const posts = {
    Query: {
        prevNext: async (_: unknown, { slug }: P_Slug) => await prevNext(slug),
        recent,
        related: async (_: unknown, { slug }: P_Slug) => await related(slug),
        post2: async (
            _: unknown,
            { slug, isAdmin }: P_Post,
            context: Context,
        ) => await post(slug, !!isAdmin, context.token),
        postByCategory: async (
            _: unknown,
            { slug, page, isAdmin }: P_PostByCategory,
            context: Context,
        ) => await postByCategory(slug, page, !!isAdmin, context.token),
        search: async (
            _: unknown,
            { keyword, page, isAdmin }: P_Search,
            context: Context,
        ) => await search(keyword, page, !!isAdmin, context.token),
    },
    Mutation: {
        updatePost: async () => {},
        // updatePosts: async () => {},
    },
}
