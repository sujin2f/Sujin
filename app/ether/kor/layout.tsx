import type { PropsWithChildren } from 'react'
/* Components */
import { Banner } from '@app/_components/header/Banner'
import { Row } from '@common/components/layout/Row'
import { Column } from '@common/components/layout/Column'
import { Header } from '@app/_components/header'
/* CONSTANTS */
import { MENU_NAMES } from '@app/_lib/types'

export default async function Layout({ children }: PropsWithChildren) {
    return (
        <>
            <Header menu={MENU_NAMES.ETHER} />

            <main>
                <Banner menu={MENU_NAMES.ETHER_KOR} />
                <article>
                    <Row>
                        <Column small={12} large={8} largeOffset={2}>
                            {children}
                        </Column>
                    </Row>
                </article>
            </main>
        </>
    )
}
