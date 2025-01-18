import React, { PropsWithChildren } from 'react'
import type { Metadata } from 'next/types'

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
    return <main>{children}</main>
}
