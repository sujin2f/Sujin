import { type PropsWithChildren } from 'react'
import type { Metadata } from 'next/types'
/* Components */
import Header from '@app/components/header'
/* Constants */
import { METADATA } from '@src/constants/system'
import { MenuNames } from '@src/constants/mysql-query'
/* Assets */
import '@src/scss/ether-data.scss'

export const metadata: Metadata = {
    ...METADATA['/ether'],
    metadataBase: new URL(METADATA['/ether'].openGraph.url),
}

export default function Layout({ children }: PropsWithChildren) {
    return (
        <>
            <Header menu={MenuNames.ETHER} />
            <main>{children}</main>
        </>
    )
}
