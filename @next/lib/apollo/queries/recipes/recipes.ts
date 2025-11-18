'use server'
import { client } from '@lib/apollo/apollo-client-server'
/* CONSTANTS */
import GQL_QUERY from '@lib/apollo/queries/recipes/recipes.graphql'
import type { T_Recipe, WithNumPages } from '@sujin/lib/types'

export const recipes = async (token: string, page: number, mine?: boolean) => {
    return await client
        .query<{ recipes: WithNumPages<T_Recipe> }>({
            query: GQL_QUERY,
            variables: { page, mine },
            context: {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        })
        .then((result) => {
            if (!result.data || !result.data.recipes) {
                throw new Error()
            }
            return result.data.recipes
        })
}
