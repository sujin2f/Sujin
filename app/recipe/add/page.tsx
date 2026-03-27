import { notFound } from 'next/navigation'
/* Components */
import { RecipeEdit } from '@app/recipe/_components/RecipeEdit'
/* Utils */
import { getUserInfo } from '@app/_lib/utils/tokens'

export const dynamic = 'force-dynamic'

export default async function LayoutRecipeAdd() {
    const user = await getUserInfo()
    if (!user) {
        notFound()
    }

    return <RecipeEdit />
}
