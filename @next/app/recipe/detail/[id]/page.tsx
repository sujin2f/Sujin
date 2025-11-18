/* Components */
import { Banner } from '@lib/components/header/Banner'
import Row from '@common/components/layout/Row'
import Column from '@common/components/layout/Column'
import { DetailClient } from './Detail.client'
/* CONSTANTS */
import { COLLECTION, MENU_NAMES } from '@sujin/lib/constants'
/* Utils */
import { getSession } from '@lib/utils/session'
import { cachedGQLRequest2 } from '@lib/apollo/queries/GQLRequest'
import { recipe as getRecipe } from '@lib/apollo/queries/recipes/recipe'

type Props = {
    params: Promise<{
        id: string
    }>
}

export default async function RecipeDetailLayout({ params }: Props) {
    const { id } = await params

    const session = await getSession()
    const loggedIn = session && session.user

    const recipe = await cachedGQLRequest2(
        getRecipe,
        '',
        [COLLECTION.RECIPE, 'detail', id],
        id,
    )

    return (
        <>
            <Banner
                menu={loggedIn ? MENU_NAMES.RECIPE_USER : MENU_NAMES.RECIPE}
                title={recipe.title}
                excerpt={recipe.url}
            />
            <Row>
                <Column large={8} largeOffset={2} small={12}>
                    <DetailClient recipe={recipe} />
                </Column>
            </Row>
        </>
    )
}
