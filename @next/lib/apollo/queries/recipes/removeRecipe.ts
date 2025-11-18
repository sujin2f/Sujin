'use server'
import { client } from '@lib/apollo/apollo-client-server'
import { getSessionContext } from '@lib/utils/session'
/* CONSTANTS */
import RECIPE_REMOVE from '@lib/apollo/queries/recipes/removeRecipe.graphql'

export const removeRecipe = async (_id: string) => {
    return await client
        .mutate<{ removeRecipe: boolean }>({
            mutation: RECIPE_REMOVE,
            variables: { _id },
            context: await getSessionContext(),
        })
        .then((result) => {
            if (!result.data || !result.data.removeRecipe) {
                throw new Error()
            }
            return result.data.removeRecipe
        })
}
