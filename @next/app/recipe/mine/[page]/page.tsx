'use server'
import { notFound } from 'next/navigation'
/* Components */
import { Banner } from '@app/@banner/_components'
import Row from '@common/components/layout/Row'
import Column from '@common/components/layout/Column'
import { RecipeTable } from '@app/recipe/_components/RecipeTable'
import { WidgetTitle } from '@app/_components/WidgetTitle'
/* CONSTANTS */
import { COLLECTION, MENU_NAMES } from '@sujin/lib/constants'
/* Utils */
import { gqlRequest } from '@app/_lib/redis'
import { recipes as getRecipes } from '@app/recipe/_lib/getRecipes'
import { getAuthHeader, getUserInfo } from '@lib/utils/server/header'

type Props = {
    params: Promise<{
        page: string
    }>
}

export default async function RecipeMyListPage(props: Props) {
    const params = await props.params
    const page = parseInt(params.page)
    const user = await getUserInfo()

    if (!user) {
        notFound()
    }

    async function action() {
        'use server'
        return await gqlRequest(
            async () => await getRecipes(page, await getAuthHeader()),
            `${COLLECTION.RECIPE}-${user!._id}-${page}`,
        )
    }

    return (
        <>
            <Banner menu={MENU_NAMES.RECIPE_USER} title="My Recipes" prefix="recipe" />
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
