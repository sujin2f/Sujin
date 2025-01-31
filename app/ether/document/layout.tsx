import React, { PropsWithChildren } from 'react'
import { MenuNames } from '@src/constants/mysql-query'

import { Banner } from '@components/header/Banner'
import { Row } from '@common/components/layout/Row'
import { Column } from '@common/components/layout/Column'

export default async function Layout({ children }: PropsWithChildren) {
    return (
        <main>
            <Banner menu={MenuNames.ETHER} />
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
