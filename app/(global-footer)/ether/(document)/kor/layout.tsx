import React, { PropsWithChildren } from 'react'
import type { Metadata } from 'next/types'

export const metadata: Metadata = {
    title: 'Sujin | Ether',
    description: '물질의 공간성과 시간성에 대한 가설',
    keywords: ['Quantum Physics', 'Theory', 'Hypothesis'],
    openGraph: {
        title: 'Sujin | Ether',
        url: `${process.env.BASE_URL}/ether/kor`,
    },
    metadataBase: new URL(`${process.env.BASE_URL}/ether/kor`),
}

export default function Layout({ children }: PropsWithChildren) {
    return <main>{children}</main>
}
