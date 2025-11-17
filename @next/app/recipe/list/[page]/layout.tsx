import type { PropsWithChildren } from 'react'
/* Components */
import { Banner } from '@lib/components/header/Banner'
import Row from '@common/components/layout/Row'
import Column from '@common/components/layout/Column'
/* CONSTANTS */
import { MENU_NAMES } from '@sujin/lib/constants'
/* Utils */
import { getSession } from '@lib/utils/session'

export default async function LayoutRecipeList({
    children,
}: PropsWithChildren) {
    const session = await getSession()
    return (
        <>
            <Banner
                menu={
                    session && session.user
                        ? MENU_NAMES.RECIPE_USER
                        : MENU_NAMES.RECIPE
                }
                excerpt="Recipe Ex asdf;93"
                title="Recipe List"
            />
            <Row>
                <Column large={8} largeOffset={2} small={12}>
                    {children}
                </Column>
            </Row>
        </>
    )
}
