'use server'
/* Utils */
import { client } from '@lib/utils/apollo-client'
import { getAuthHeader } from '@lib/utils/server/header'
import { removeCache } from '@lib/utils/redis'
/* CONSTANTS */
import QUERY from '@lib/apollo/queries/recipes/replaceRecipe.graphql'
import { COLLECTION } from '@sujin/lib/constants'
/* T_Type */
import type { T_Recipe } from '@sujin/lib/types'

export const replaceRecipe = async (recipe: Partial<T_Recipe>) => {
    return await client
        .mutate<{ replaceRecipe: string }>({
            mutation: QUERY,
            variables: { recipe },
            context: await getAuthHeader(),
        })
        .then(async (result) => {
            if (!result.data || !result.data.replaceRecipe) {
                throw new Error()
            }
            // TODO store recipe list as individual recipes
            await removeCache(COLLECTION.RECIPE) // TODO when the return type of endpoint is recipe, remove list, _id, and mine
            return result.data.replaceRecipe
        })
}
