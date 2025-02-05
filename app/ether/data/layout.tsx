import { type PropsWithChildren } from 'react'
import type { Metadata } from 'next/types'
/* Helpers */
import { METADATA } from '@src/constants/system'
/* Assets */
import '@src/scss/ether-data.scss'

export const metadata: Metadata = {
    ...METADATA['/ether'],
    metadataBase: new URL(METADATA['/ether'].openGraph.url),
}

export default function Layout({ children }: PropsWithChildren) {
    return <main>{children}</main>
}
