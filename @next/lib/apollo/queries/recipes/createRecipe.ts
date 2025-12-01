'use server'
/* Utils */
import { client } from '@lib/apollo/apollo-client-server'
import { getAuthHeader } from '@lib/utils/server/header'
import { removeCache } from '@lib/utils/redis'
/* CONSTANTS */
import RECIPE_CREATE from '@lib/apollo/queries/recipes/createRecipe.graphql'
import { COLLECTION } from '@sujin/lib/constants'
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
            await removeCache(COLLECTION.RECIPE) // TODO when the return type of endpoint is recipe, remove list, _id, and mine
            return result.data.createRecipe
        })
}
