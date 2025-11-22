'use server'
import { client } from '@lib/apollo/apollo-client-server'
import { getAuthHeader } from '@lib/utils/server'
/* CONSTANTS */
import RECIPE_CREATE from '@lib/apollo/queries/recipes/createRecipe.graphql'
import type { T_Recipe } from '@sujin/lib/types'

export const createRecipe = async (recipe: Partial<T_Recipe>) => {
    return await client
        .mutate<{ createRecipe: string }>({
            mutation: RECIPE_CREATE,
            variables: { recipe },
            context: await getAuthHeader(),
        })
        .then((result) => {
            if (!result.data || !result.data.createRecipe) {
                throw new Error()
            }
            return result.data.createRecipe
        })
}
