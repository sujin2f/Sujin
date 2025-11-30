/* Components */
import { Banner } from '@lib/components/header/Banner'
import Row from '@common/components/layout/Row'
import Column from '@common/components/layout/Column'
import { DetailClient } from './page.client'
/* CONSTANTS */
import { COLLECTION, MENU_NAMES } from '@sujin/lib/constants'
/* Utils */
import { getUserInfo } from '@lib/utils/server/header'
import { redisCachedRequest } from '@lib/apollo/queries/GQLRequest'
import { recipe as getRecipe } from '@lib/apollo/queries/recipes/recipe'

type Props = {
    params: Promise<{
        id: string
    }>
}

export default async function RecipeDetailLayout({ params }: Props) {
    const { id } = await params
    const user = await getUserInfo()
    const recipe = await redisCachedRequest(async () => await getRecipe(id), {
        key: `${COLLECTION.RECIPE}-${id}`,
    })

    return (
        <>
            <Banner menu={user ? MENU_NAMES.RECIPE_USER : MENU_NAMES.RECIPE} title={recipe.title} prefix="Recipe" />
            <Row>
                <Column large={8} largeOffset={2} small={12}>
                    <DetailClient recipe={recipe} />
                </Column>
            </Row>
        </>
    )
}
