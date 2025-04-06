import React, { type PropsWithChildren } from 'react'
/* Components */
import { Banner } from '@app/_components/header/Banner'
import { Row } from '@common/components/layout/Row'
import { Column } from '@common/components/layout/Column'
/* Helpers */
import { MenuNames } from '@app/_lib/data/mysql/constants'

export default async function Layout({ children }: PropsWithChildren) {
    return (
        <main>
            <Banner menu={MenuNames.ETHER_KOR} />
            <article>
                <Row>
                    <Column small={12} large={8} largeOffset={2}>
                        {children}
                    </Column>
                </Row>
            </article>
        </main>
    )
}
