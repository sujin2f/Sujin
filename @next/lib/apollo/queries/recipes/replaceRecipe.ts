'use server'
/* Models */
import Cached from '@sujin/share/model/Cache'
/* Utils */
import { client } from '@lib/apollo/apollo-client-server'
import { getAuthHeader } from '@lib/utils/server/header'
import { getCacheKey } from '@sujin/lib/utils/cache'
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
            Cached.getInstance().flush(getCacheKey(COLLECTION.RECIPE))
            return result.data.replaceRecipe
        })
}
