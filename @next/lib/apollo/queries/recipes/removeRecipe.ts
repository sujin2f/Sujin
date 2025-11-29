'use server'
/* Models */
import Cached from '@sujin/share/model/Cache'
/* Utils */
import { client } from '@lib/apollo/apollo-client-server'
import { getAuthHeader } from '@lib/utils/server/header'
import { getCacheKey } from '@sujin/lib/utils/cache'
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
            await Cached.getInstance().flush(getCacheKey(COLLECTION.RECIPE))
            return result.data.removeRecipe
        })
}
