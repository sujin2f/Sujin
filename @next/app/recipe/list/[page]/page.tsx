'use server'
/* Utils */
import { nextCachedRequest } from '@lib/apollo/queries/GQLRequest'
import { recipes as getRecipes } from '@lib/apollo/queries/recipes/recipes'
import { getUserInfo } from '@lib/utils/server'
/* Components */
import { Banner } from '@lib/components/header/Banner'
import { RecipeTable } from '@lib/components/recipes/RecipeTable'
import { WidgetTitle } from '@lib/components/WidgetTitle'
import Row from '@common/components/layout/Row'
import Column from '@common/components/layout/Column'
/* CONSTANTS */
import { COLLECTION, MENU_NAMES } from '@sujin/lib/constants'

type Props = {
    params: Promise<{
        page: string
    }>
}

export default async function ListPage(props: Props) {
    const user = await getUserInfo()
    const params = await props.params
    const page = parseInt(params.page)
    async function action() {
        'use server'
        return await nextCachedRequest(getRecipes(page), COLLECTION.RECIPE, 'list', page.toString())
    }

    return (
        <>
            <Banner
                menu={user ? MENU_NAMES.RECIPE_USER : MENU_NAMES.RECIPE}
                title="Recipe List"
                excerpt="The recipe manager with measurement conversion"
                prefix="recipe"
            />
            <Row>
                <Column large={8} largeOffset={2} small={12}>
                    <article>
                        <WidgetTitle>Recipe List</WidgetTitle>
                        <RecipeTable action={action} page={page} />
                    </article>
                </Column>
            </Row>
        </>
    )
}
