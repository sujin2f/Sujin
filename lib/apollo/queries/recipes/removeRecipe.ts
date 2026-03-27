'use server'
/* Utils */
import { client } from '@app/_lib/graphql/client'
import { getAuthHeader } from '@app/_lib/utils/tokens'
/* CONSTANTS */
import RECIPE_REMOVE from '@lib/apollo/queries/recipes/removeRecipe-gql.graphql'

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
            return result.data.removeRecipe
        })
}
