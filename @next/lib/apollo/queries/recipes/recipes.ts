'server-only'
import type { DefaultContext } from '@apollo/client'
/* Utils */
import { client } from '@lib/apollo/apollo-client-server'
/* CONSTANTS */
import GQL_QUERY from '@lib/apollo/queries/recipes/recipes.graphql'
/* T_Types */
import type { T_Recipe, WithNumPages } from '@sujin/lib/types'

export const recipes = async (page: number, context?: DefaultContext) => {
    return await client
        .query<{ recipes: WithNumPages<T_Recipe> }>({
            query: GQL_QUERY,
            variables: { page, mine: !!context },
            context,
        })
        .then((result) => {
            if (!result.data || !result.data.recipes) {
                throw new Error()
            }
            return result.data.recipes
        })
}
