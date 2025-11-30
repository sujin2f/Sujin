'use server'
/* Components */
import { Banner } from '@lib/components/header/Banner'
import Row from '@common/components/layout/Row'
import Column from '@common/components/layout/Column'
import { RecipeTable } from '@lib/components/recipes/RecipeTable'
import { WidgetTitle } from '@lib/components/WidgetTitle'
/* CONSTANTS */
import { COLLECTION, MENU_NAMES } from '@sujin/lib/constants'
/* Utils */
import { getUserInfo } from '@lib/utils/server/header'
import { redisCachedRequest } from '@lib/apollo/queries/GQLRequest'
import { recipes as getRecipes } from '@lib/apollo/queries/recipes/recipes'

export default async function PageRecipe() {
    const user = await getUserInfo()

    async function action() {
        'use server'
        return await redisCachedRequest(async () => await getRecipes(1), {
            key: `${COLLECTION.RECIPE}-list-1`,
        })
    }

    return (
        <>
            <Banner
                menu={user ? MENU_NAMES.RECIPE_USER : MENU_NAMES.RECIPE}
                excerpt="The recipe manager with measurement conversion"
                title="Recipe"
            />
            <Row>
                <Column large={8} largeOffset={2} small={12}>
                    <article>
                        <WidgetTitle>Recipe List</WidgetTitle>
                        <RecipeTable action={action} page={1} />
                    </article>
                </Column>
            </Row>
        </>
    )
}
