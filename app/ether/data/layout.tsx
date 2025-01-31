import { PropsWithChildren, Suspense } from 'react'
import type { Metadata } from 'next/types'

import { MenuNames } from '@src/constants/mysql-query'
import Loading from '@app/loading'

import '@src/scss/ether-data.scss'

export const metadata: Metadata = {
    title: 'Sujin | Ether',
    description: 'Hypothesis on the Spatial and Temporal Aspects of Matter',
    keywords: ['Quantum Physics', 'Theory', 'Hypothesis'],
    openGraph: {
        title: 'Sujin | Ether',
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/ether`,
    },
    metadataBase: new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/ether`),
}

export default function Layout({ children }: PropsWithChildren) {
    return (
        <Suspense fallback={<Loading menu={MenuNames.ETHER} />}>
            <main>{children}</main>
        </Suspense>
    )
}
