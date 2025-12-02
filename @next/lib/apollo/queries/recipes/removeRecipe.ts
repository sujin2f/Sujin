'use server'
/* Utils */
import { client } from '@lib/utils/apollo-client'
import { getAuthHeader } from '@lib/utils/server/header'
import { removeCache } from '@lib/utils/redis'
/* CONSTANTS */
import { COLLECTION } from '@sujin/lib/constants'
import RECIPE_REMOVE from '@lib/apollo/queries/recipes/removeRecipe.graphql'

export const removeRecipe = async (_id: string) => {
    return await client
        .mutate<{ removeRecipe: boolean }>({
            mutation: RECIPE_REMOVE,
            variables: { _id },
            context: await getAuthHeader(),
        })
        .then(async (result) => {
            if (!result.data || !result.data.removeRecipe) {
                throw new Error()
            }
            await removeCache(COLLECTION.RECIPE) // TODO when the return type of endpoint is recipe, remove list, _id, and mine
            return result.data.removeRecipe
        })
}
