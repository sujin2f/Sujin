import { mergeTypeDefs } from '@graphql-tools/merge'

import misc from '@src/resolvers/misc/types.graphql'
import users from '@src/resolvers/users/types.graphql'
import recipes from '@src/resolvers/recipes/types.graphql'
import focus from '@src/resolvers/focus/types.graphql'
import admin from '@src/resolvers/admin/types.graphql'
import { typeDefs as wordpress } from '@src/resolvers/wordpress/typeDefs'

/**
 * Combined GraphQL type definitions.
 *
 * Merges type definitions provided by each feature resolver into a single
 * schema piece consumed by the GraphQL server setup.
 */
export const typeDefs = mergeTypeDefs([misc, users, recipes, wordpress, focus, admin])
