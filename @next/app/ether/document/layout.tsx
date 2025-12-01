import type { PropsWithChildren } from 'react'
/* Components */
import { Banner } from '@lib/components/header/Banner'
import Row from '@common/components/layout/Row'
import Column from '@common/components/layout/Column'
/* CONSTANTS */
import { MENU_NAMES } from '@sujin/lib/constants'

/**
 * Layout component
 * @param {ReactNode} props.children - The content to be wrapped by the layout.
 */
export default async function Layout({ children }: PropsWithChildren) {
    return (
        <>
            <Banner menu={MENU_NAMES.ETHER} />
            <Row>
                <Column large={8} small={12} largeOffset={2}>
                    {children}
                </Column>
            </Row>
        </>
    )
}
