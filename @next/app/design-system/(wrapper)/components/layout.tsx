import type { PropsWithChildren } from 'react'
import type { Metadata } from 'next'
/* Components */
import { Banner } from '@lib/components/header/Banner'
import Row from '@common/components/layout/Row'
import Column from '@common/components/layout/Column'
/* CONSTANTS */
import { MENU_NAMES } from '@sujin/lib/constants'

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
        nocache: false,
    },
}

/**
 * Layout component
 * @param {ReactNode} props.children - The content to be wrapped by the layout.
 */
export default async function Layout({ children }: PropsWithChildren) {
    return (
        <>
            <Banner title="Components" prefix="Design System" menu={MENU_NAMES.DESIGN_SYSTEM} />
            <Row>
                <Column small={12}>
                    <article>{children}</article>
                </Column>
            </Row>
        </>
    )
}
