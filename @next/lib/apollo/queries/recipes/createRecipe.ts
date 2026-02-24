'use server'
/* Utils */
import { client } from '@lib/utils/apollo-client'
import { getAuthHeader } from '@app/_lib/utils/tokens'
/* CONSTANTS */
import RECIPE_CREATE from '@lib/apollo/queries/recipes/createRecipe-gql.graphql'
/* T_Type */
import type { T_Recipe } from '@sujin/lib/types'

export const createRecipe = async (recipe: Partial<T_Recipe>) => {
    return await client
        .mutate<{ createRecipe: string }>({
            mutation: RECIPE_CREATE,
            variables: { recipe },
            context: await getAuthHeader(),
        })
        .then(async (result) => {
            if (!result.data || !result.data.createRecipe) {
                throw new Error()
            }
            return result.data.createRecipe
        })
}
