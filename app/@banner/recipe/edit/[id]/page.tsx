/* Components */
import { Banner } from '@app/@banner/_components'
/* Utils */
import { getUserInfo } from '@app/_lib/utils/tokens'
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
                menu={user ? 'recipe-user' : 'recipe'}
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
