'use client'
/* Components */
import { RecipeList } from '@app/recipe/_components/RecipeList'

export const dynamic = 'force-dynamic'

export default function PageRecipe() {
    return <RecipeList page={1} />
}
