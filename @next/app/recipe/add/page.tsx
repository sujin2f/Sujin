import { notFound } from 'next/navigation'
/* Components */
import { Banner } from '@app/@banner/_components'
import Row from '@common/components/layout/Row'
import Column from '@common/components/layout/Column'
import { RecipeEdit } from '@lib/components/recipes/RecipeEdit'
/* CONSTANTS */
import { MENU_NAMES } from '@sujin/lib/constants'
/* Utils */
import { getUserInfo } from '@lib/utils/server/header'

export default async function LayoutRecipeAdd() {
    const user = await getUserInfo()
    if (!user) {
        notFound()
    }

    return (
        <>
            <Banner menu={MENU_NAMES.RECIPE_USER} title="Write New Recipe" prefix="recipe" />
            <Row>
                <Column large={8} largeOffset={2} small={12}>
                    <RecipeEdit />
                </Column>
            </Row>
        </>
    )
}
