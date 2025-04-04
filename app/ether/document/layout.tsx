import React, { type PropsWithChildren } from 'react'
/* Components */
import Header from '@app/components/header'
import Banner from '@app/components/header/Banner'
import { Row } from '@common/components/layout/Row'
import { Column } from '@common/components/layout/Column'
/* Helpers */
import { MenuNames } from '@app/helpers/constants/mysql-query'

export default async function Layout({ children }: PropsWithChildren) {
    return (
        <>
            <Header menu={MenuNames.ETHER} />
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
        </>
    )
}
