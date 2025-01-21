import React, { PropsWithChildren, Suspense } from 'react'
import type { Metadata } from 'next/types'
import { FixedHeader } from '@components/header/FixedHeader'
import { MenuNames } from '@src/constants/mysql-query'
import Loading from '@app/loading'

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
    return (
        <>
            <FixedHeader menu={MenuNames.ETHER_KOR} />
            <Suspense fallback={<Loading menu={MenuNames.ETHER_KOR} />}>
                <main>{children}</main>
            </Suspense>
        </>
    )
}
