/* Components */
import { Banner } from '@lib/components/header/Banner'
import Row from '@common/components/layout/Row'
import Column from '@common/components/layout/Column'
/* CONSTANTS */
import { MENU_NAMES } from '@sujin/lib/constants'
/* Utils */
import { getSession } from '@lib/utils/session'

export default async function PageRecipe() {
    const session = await getSession()

    return (
        <>
            <Banner
                menu={
                    session && session.user
                        ? MENU_NAMES.RECIPE_USER
                        : MENU_NAMES.RECIPE
                }
                excerpt="Recipe Description asdfasdfasdf"
                title="Recipe"
            />
            <Row>
                <Column large={8} largeOffset={2} small={12}>
                    Introduction 645a1sdf
                </Column>
            </Row>
        </>
    )
}
