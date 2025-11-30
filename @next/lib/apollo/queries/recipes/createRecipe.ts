'use server'
/* Models */
import Cached from '@sujin/share/model/Cache'
/* Utils */
import { client } from '@lib/apollo/apollo-client-server'
import { getAuthHeader } from '@lib/utils/server/header'
import { getCacheKey } from '@sujin/lib/utils/cache'
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
            Cached.getInstance().flush(getCacheKey(COLLECTION.RECIPE))
            return result.data.createRecipe
        })
}
