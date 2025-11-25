import { notFound } from 'next/navigation'
/* Components */
import { Banner } from '@lib/components/header/Banner'
import Row from '@common/components/layout/Row'
import Column from '@common/components/layout/Column'
/* CONSTANTS */
import { COLLECTION, MENU_NAMES } from '@sujin/lib/constants'
/* Utils */
import { getUserInfo } from '@lib/utils/server'
import RecipeEditClient from './Edit.client'
import { cachedGQLRequest2 } from '@lib/apollo/queries/GQLRequest'
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
    const recipe = await cachedGQLRequest2(getRecipe, '', [COLLECTION.RECIPE, 'detail', id], id)

    if (recipe.user !== user._id) {
        notFound()
    }

    return (
        <>
            <Banner menu={MENU_NAMES.RECIPE_USER} excerpt="Recipe Ex asdf;9asdfa asdfasdf3" title="Write New Recipe" />
            <Row>
                <Column large={8} largeOffset={2} small={12}>
                    <RecipeEditClient recipe={recipe} />
                </Column>
            </Row>
        </>
    )
}
