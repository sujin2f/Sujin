import { PropsWithChildren, Suspense } from 'react'
import type { Metadata } from 'next/types'

import { FixedHeader } from '@components/header/FixedHeader'
import { MenuNames } from '@src/constants/mysql-query'
import Loading from '@app/loading'

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

export default function Layout({ children }: PropsWithChildren) {
    return (
        <>
            <FixedHeader menu={MenuNames.ETHER} className="top-bar--ether" />
            <Suspense fallback={<Loading menu={MenuNames.ETHER} />}>
                {children}
            </Suspense>
        </>
    )
}
