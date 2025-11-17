import { mergeTypeDefs } from '@graphql-tools/merge'

import misc from '@src/types/gql/misc.graphql'
import users from '@src/types/gql/users.graphql'
import recipe from '@src/types/gql/recipe.graphql'
import wp from '@src/types/gql/wordpress.graphql'

export const typeDefs = mergeTypeDefs([misc, users, recipe, wp])
