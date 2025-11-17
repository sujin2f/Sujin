import { posts } from '@src/resolvers/wordpress/posts'
import { pages } from '@src/resolvers/wordpress/pages'
import { backgrounds } from '@src/resolvers/wordpress/backgrounds'
import { archives } from '@src/resolvers/wordpress/archives'

export const wordpress = {
    Query: {
        ...posts.Query,
        ...pages.Query,
        ...backgrounds.Query,
        ...archives.Query,
    },
    Mutation: {
        ...posts.Mutation,
        ...pages.Mutation,
        ...backgrounds.Mutation,
        ...archives.Mutation,
    },
}
