import { posts } from '@src/resolvers/wordpress/posts'
import { pages } from '@src/resolvers/wordpress/pages'

export const wordpress = {
    Query: {
        ...posts.Query,
        ...pages.Query,
    },
    Mutation: {
        ...posts.Mutation,
        ...pages.Mutation,
    },
}
