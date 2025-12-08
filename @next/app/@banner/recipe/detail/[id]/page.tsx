/* Components */
import { Banner } from '@app/@banner/_components'
/* CONSTANTS */
import { MENU_NAMES } from '@sujin/lib/constants'
/* Utils */
import { getUserInfo } from '@lib/utils/server/header'
import { getRecipe } from '@app/recipe/_lib/getRecipe'
import Link from 'next/link'

type Props = {
    params: Promise<{
        id: string
    }>
}

export default async function RecipeDetailLayout({ params }: Props) {
    const { id } = await params
    const user = await getUserInfo()
    const recipe = await getRecipe(id)

    return (
        <>
            <Banner
                menu={user ? MENU_NAMES.RECIPE_USER : MENU_NAMES.RECIPE}
                title={recipe.title}
                excerpt={
                    recipe.url ? (
                        <Link href={recipe.url} target="_blank">
                            Read Original Recipe
                        </Link>
                    ) : (
                        ''
                    )
                }
                prefix="Recipe"
            />
        </>
    )
}
