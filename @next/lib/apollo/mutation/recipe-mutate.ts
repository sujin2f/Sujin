'use server'
import { client } from '@lib/apollo/apollo-client-server'
import { getSessionContext } from '@lib/apollo/admin'
/* CONSTANTS */
import RECIPE_MUTATION from '@lib/apollo/gql/recipe.mutate.graphql'
import { T_Recipe } from '@sujin/lib/types'

export const mutateRecipe = async (recipe: Partial<T_Recipe>) => {
    return await client
        .mutate<{ mutateRecipe: string }>({
            mutation: RECIPE_MUTATION,
            variables: { recipe },
            context: await getSessionContext(),
        })
        .then((result) => {
            if (!result.data || !result.data.mutateRecipe) {
                throw new Error()
            }
            return result.data.mutateRecipe
        })
}
