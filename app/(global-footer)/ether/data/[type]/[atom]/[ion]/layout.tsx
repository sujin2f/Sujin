import { PropsWithChildren } from 'react'

import type { Metadata } from 'next/types'
import { Row } from '@common/components/layout/Row'
import { ScrollToTop } from '@components/ScrollToTop'
import { Column } from '@common/components/layout/Column'
import { DataHeader } from '@components/(ether)/data-header'

export const metadata: Metadata = {
    title: 'Sujin | Ether',
    description: 'Hypothesis on the Spatial and Temporal Aspects of Matter',
    keywords: ['Quantum Physics', 'Theory', 'Hypothesis'],
    openGraph: {
        title: 'Sujin | Ether',
        url: `${process.env.BASE_URL}/ether`,
    },
    metadataBase: new URL(`${process.env.BASE_URL}/ether`),
}

import '@src/scss/ether-data.scss'

export default function Layout({ children }: PropsWithChildren) {
    return (
        <>
            <DataHeader />
            <Row>
                <ScrollToTop />
                <Column small={12}>{children}</Column>
            </Row>
        </>
    )
}
