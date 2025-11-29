import { notFound } from 'next/navigation'
/* Components */
import { Banner } from '@lib/components/header/Banner'
import Row from '@common/components/layout/Row'
import Column from '@common/components/layout/Column'
import { RecipeEdit } from '@lib/components/recipes/RecipeEdit'
/* CONSTANTS */
import { COLLECTION, MENU_NAMES } from '@sujin/lib/constants'
/* Utils */
import { getUserInfo } from '@lib/utils/server/header'
import { nextCachedRequest } from '@lib/apollo/queries/GQLRequest'
import { recipe as getRecipe } from '@lib/apollo/queries/recipes/recipe'

type Props = {
    params: Promise<{
        id: string
    }>
}

export default async function PageRecipeEdit({ params }: Props) {
    const user = await getUserInfo()
    if (!user) {
        notFound()
    }

    const { id } = await params
    const recipe = await nextCachedRequest(getRecipe(id), COLLECTION.RECIPE, 'detail', id)

    if (recipe.user !== user._id) {
        notFound()
    }

    return (
        <>
            <Banner menu={MENU_NAMES.RECIPE_USER} prefix="Recipe" title={`Edit ${recipe.title}`} />
            <Row>
                <Column large={8} largeOffset={2} small={12}>
                    <RecipeEdit recipe={recipe} />
                </Column>
            </Row>
        </>
    )
}
