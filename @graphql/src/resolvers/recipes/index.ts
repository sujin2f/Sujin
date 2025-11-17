import { recipe } from '@src/resolvers/recipes/recipe'
import { mutateRecipe } from '@src/resolvers/recipes/mutateRecipe'

import type { Context } from '@src/types'
import type { T_Recipe } from '@sujin/lib/types'

export const recipes = {
    Query: {
        recipe: async (_: unknown, { _id }: { _id: string }) =>
            await recipe(_id),
        recipes: async () => {},
    },
    Mutation: {
        mutateRecipe: async (
            _: unknown,
            { recipe }: { recipe: T_Recipe },
            context: Context,
        ) => await mutateRecipe(recipe, context),
        removeRecipe: async () => {},
    },
}
