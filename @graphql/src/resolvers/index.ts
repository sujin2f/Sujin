// TODO use graphql-tools https://the-guild.dev/graphql/tools/docs/schema-merging#merging-resolvers https://github.com/sujin2f/Sujin/issues/179

import { users } from '@src/resolvers/users'
import { recipes } from '@src/resolvers/recipes'
import { misc } from '@src/resolvers/misc'
import { wordpress } from '@src/resolvers/wordpress'
import { focus } from '@src/resolvers/focus'

/**
 * Root GraphQL resolver map assembled from feature-specific resolvers.
 *
 * - `Query` merges query resolvers from `recipes`, `misc`, and `wordpress`.
 * - `Mutation` merges mutation resolvers from `users`, `recipes`, `misc`, and `wordpress`.
 */
export const Query = {
    ...recipes.Query,
    ...misc.Query,
    ...wordpress.Query,
    ...focus.Query,
}

export const Mutation = {
    ...users.Mutation,
    ...recipes.Mutation,
    ...focus.Mutation,
}
