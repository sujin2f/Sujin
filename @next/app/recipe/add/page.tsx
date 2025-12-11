import { notFound } from 'next/navigation'
/* Components */
import { RecipeEdit } from '@app/recipe/_components/RecipeEdit'
/* Utils */
import { getUserInfo } from '@lib/utils/server/header'

export default async function LayoutRecipeAdd() {
    const user = await getUserInfo()
    if (!user) {
        notFound()
    }

    return <RecipeEdit />
}
