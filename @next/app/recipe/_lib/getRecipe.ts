'use server'
/* Utils */
import { client } from '@lib/utils/apollo-client'
import { gqlRequest } from '@app/_lib/redis'
/* CONSTANTS */
import query from '@app/recipe/_lib/getRecipe.graphql'
import { COLLECTION } from '@sujin/lib/constants'
/* T_Types */
import type { T_Recipe } from '@sujin/lib/types'

export const getRecipe = async (id: string): Promise<T_Recipe> => {
    'use server'
    return await gqlRequest(
        async () =>
            await client
                .query<{ recipe: T_Recipe }>({
                    query,
                    variables: { id },
                })
                .then((result) => {
                    if (!result.data || !result.data.recipe) {
                        throw new Error()
                    }
                    return result.data.recipe
                }),
        `${COLLECTION.RECIPE}-${id}`,
    )
}
