import { mergeTypeDefs } from '@graphql-tools/merge'

import misc from '@src/resolvers/misc/types.graphql'
import users from '@src/resolvers/users/types.graphql'
import recipes from '@src/resolvers/recipes/types.graphql'
import { typeDefs as wordpress } from '@src/resolvers/wordpress/typeDefs'

export const typeDefs = mergeTypeDefs([misc, users, recipes, wordpress])
