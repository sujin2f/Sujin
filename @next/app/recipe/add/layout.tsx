import type { PropsWithChildren } from 'react'
import { notFound } from 'next/navigation'
/* Components */
import { Banner } from '@lib/components/header/Banner'
import Row from '@common/components/layout/Row'
import Column from '@common/components/layout/Column'
/* CONSTANTS */
import { MENU_NAMES } from '@sujin/lib/constants'
/* Utils */
import { getSession } from '@lib/utils/session'

export default async function LayoutRecipeAdd({ children }: PropsWithChildren) {
    const session = await getSession()

    const loggedIn = session && session.user
    if (!loggedIn) {
        notFound()
    }

    return (
        <>
            <Banner
                menu={MENU_NAMES.RECIPE_USER}
                excerpt="Recipe Ex asdf;9asdfa asdfasdf3"
                title="Write New Recipe"
            />
            <Row>
                <Column large={8} largeOffset={2} small={12}>
                    {children}
                </Column>
            </Row>
        </>
    )
}
