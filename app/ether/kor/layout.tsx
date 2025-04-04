import React, { type PropsWithChildren } from 'react'
/* Components */
import Banner from '@app/components/header/Banner'
import { Row } from '@common/components/layout/Row'
import { Column } from '@common/components/layout/Column'
/* Helpers */
import { MenuNames } from '@src/constants/mysql-query'

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
