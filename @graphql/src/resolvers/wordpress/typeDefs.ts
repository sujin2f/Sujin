import { mergeTypeDefs } from '@graphql-tools/merge'

import wordpress from '@src/resolvers/wordpress/types.graphql'
import archives from '@src/resolvers/wordpress/archives/types.graphql'
import backgrounds from '@src/resolvers/wordpress/backgrounds/types.graphql'
import pages from '@src/resolvers/wordpress/pages/types.graphql'
import posts from '@src/resolvers/wordpress/posts/types.graphql'

export const typeDefs = mergeTypeDefs([
    archives,
    backgrounds,
    pages,
    posts,
    wordpress,
])
