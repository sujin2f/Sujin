import { PropsWithChildren } from 'react'

import type { Metadata } from 'next/types'
import { periodicTable } from '@src/constants/spectra'

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

type Props = {
    params: Promise<{
        atom: number
        ion: number
    }>
}

import '@src/scss/ether-data.scss'

export default async function EtherDataLayout(props: PropsWithChildren<Props>) {
    const { atom } = await props.params

    return (
        <>
            <aside className="header--ether--data">
                <nav>
                    <a>Prev</a>
                    <h1>{periodicTable[atom - 1].name}</h1>
                    <a>Next</a>
                </nav>
            </aside>
            <main>{props.children}</main>
        </>
    )
}
