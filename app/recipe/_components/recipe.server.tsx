import { T_Recipe } from '@app/_lib/types'
import { RecipeClient } from '@app/recipe/_components/recipe.client'
import { insertRecipe } from '@app/_lib/data/mongo/recipe'

type Props = {
    page: number
}

export async function RecipeServer({ page }: Props) {
    const addRecipe = async (recipe: Omit<T_Recipe, '_id' | 'user'>) => {
        'use server'
        await insertRecipe(recipe)
    }

    return (
        <>
            <RecipeClient page={page} addRecipe={addRecipe} />
        </>
    )
}
