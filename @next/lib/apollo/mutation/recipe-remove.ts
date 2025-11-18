'use server'
import { client } from '@lib/apollo/apollo-client-server'
import { getSessionContext } from '@lib/utils/session'
/* CONSTANTS */
import RECIPE_REMOVE from '@lib/apollo/gql/recipe.remove.graphql'

export const removeRecipe = async (id: string) => {
    return await client
        .mutate<{ deleteRecipe: boolean }>({
            mutation: RECIPE_REMOVE,
            variables: { id },
            context: await getSessionContext(),
        })
        .then((result) => {
            if (!result.data || !result.data.deleteRecipe) {
                throw new Error()
            }
            return result.data.deleteRecipe
        })
}
