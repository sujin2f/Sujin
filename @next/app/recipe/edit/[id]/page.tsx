import { notFound } from 'next/navigation'
/* Components */
import { RecipeEdit } from '@app/recipe/_components/RecipeEdit'
/* CONSTANTS */
import { COLLECTION } from '@sujin/lib/constants'
/* Utils */
import { getUserInfo } from '@lib/utils/server/header'
import { gqlRequest } from '@app/_lib/utils/redis'
import { getRecipe } from '@app/recipe/_lib/getRecipe'

type Props = {
    params: Promise<{
        id: string
    }>
}

export const dynamic = 'force-dynamic'

export default async function PageRecipeEdit({ params }: Props) {
    const user = await getUserInfo()
    if (!user) {
        notFound()
    }

    const { id } = await params
    const recipe = await gqlRequest(async () => await getRecipe(id), `${COLLECTION.RECIPE}-${id}`)

    if (recipe.user !== user._id) {
        notFound()
    }

    return <RecipeEdit recipe={recipe} />
}
