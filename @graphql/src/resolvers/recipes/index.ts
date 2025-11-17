import { recipe } from '@src/resolvers/recipes/recipe'
import { recipes as getRecipes } from '@src/resolvers/recipes/recipes'
import { createRecipe } from '@src/resolvers/recipes/createRecipe'
import { updateRecipe } from '@src/resolvers/recipes/updateRecipe'
import { removeRecipe } from '@src/resolvers/recipes/removeRecipe'

import type { T_Context } from '@src/types'
import type {
    T_GQL_Params_Id,
    T_GQL_Params_Recipe_Mutate,
    T_GQL_Params_Recipes,
} from '@sujin/lib/types'

export const recipes = {
    Query: {
        recipe: async (_: unknown, { _id }: T_GQL_Params_Id) =>
            await recipe(_id),
        recipes: async (
            _: unknown,
            { page, mine }: T_GQL_Params_Recipes,
            context: T_Context,
        ) => await getRecipes(page, mine, context.token),
    },
    Mutation: {
        createRecipe: async (
            _: unknown,
            { recipe }: T_GQL_Params_Recipe_Mutate,
            context: T_Context,
        ) => await createRecipe(recipe, context.token),
        updateRecipe: async (
            _: unknown,
            { recipe }: T_GQL_Params_Recipe_Mutate,
            context: T_Context,
        ) => await updateRecipe(recipe, context.token),
        removeRecipe: async (
            _: unknown,
            { _id }: T_GQL_Params_Id,
            context: T_Context,
        ) => await removeRecipe(_id, context.token),
    },
}
