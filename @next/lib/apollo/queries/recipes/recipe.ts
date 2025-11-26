'use server'
import { client } from '@lib/apollo/apollo-client-server'
/* CONSTANTS */
import GQL_QUERY from '@lib/apollo/queries/recipes/recipe.graphql'
import type { T_Recipe } from '@sujin/lib/types'

export const recipe = async (id: string) => {
    return await client
        .query<{ recipe: T_Recipe }>({
            query: GQL_QUERY,
            variables: { id },
        })
        .then((result) => {
            if (!result.data || !result.data.recipe) {
                throw new Error()
            }
            return result.data.recipe
        })
}
