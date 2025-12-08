'use server'
import type { DefaultContext } from '@apollo/client'
/* Utils */
import { client } from '@lib/utils/apollo-client'
import { gqlRequest } from '@app/_lib/redis'
/* CONSTANTS */
import query from '@app/recipe/_lib/getRecipes.graphql'
import { IS_DEV } from '@sujin/share/constants/helper'
import { COLLECTION } from '@sujin/lib/constants'
/* T_Types */
import type { T_Recipe, WithNumPages } from '@sujin/lib/types'

export const getRecipes = async (page: number, context?: DefaultContext) => {
    'use server'
    return await gqlRequest(
        async () =>
            await client
                .query<{ recipes: WithNumPages<T_Recipe> }>({
                    query,
                    variables: { page, mine: !!context },
                    context,
                    fetchPolicy: IS_DEV ? 'network-only' : 'cache-first',
                })
                .then((result) => {
                    if (!result.data || !result.data.recipes) {
                        throw new Error()
                    }
                    return result.data.recipes
                }),
        `${COLLECTION.RECIPE}-list-1`,
    ).catch(() => ({
        numPages: 0,
        items: [],
    }))
}
