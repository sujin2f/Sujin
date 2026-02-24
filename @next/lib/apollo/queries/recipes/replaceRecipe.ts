'use server'
/* Utils */
import { client } from '@app/_lib/graphql/client'
import { getAuthHeader } from '@app/_lib/utils/tokens'
/* CONSTANTS */
import QUERY from '@lib/apollo/queries/recipes/replaceRecipe-gql.graphql'
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
            return result.data.replaceRecipe
        })
}
