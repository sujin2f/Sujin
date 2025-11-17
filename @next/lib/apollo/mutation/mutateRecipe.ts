'use server'
import { client } from '@lib/apollo/apollo-client-server'
import { getSessionContext } from '@lib/apollo/admin'
/* CONSTANTS */
import RECIPE_MUTATION from '@lib/apollo/gql/mutateRecipe.graphql'
import { T_Recipe } from '@sujin/lib/types'

export const mutateRecipe = async (recipe: Partial<T_Recipe>) => {
    return await client
        .mutate({
            mutation: RECIPE_MUTATION,
            variables: { recipe },
            context: await getSessionContext(),
        })
        .then((result) => {
            console.log(result)
            // if (!result.data) {
            //     return 'false'
            // }
            // return 'true'
        })
        .catch(console.log)
}
