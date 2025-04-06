import { type PropsWithChildren } from 'react'
import type { Metadata } from 'next/types'
/* Components */
import { Header } from '@app/_components/header'
/* Constants */
import { METADATA } from '@app/_lib/constants'
import { MenuNames } from '@app/_lib/data/mysql/constants'
/* Assets */
import './style.scss'

export const metadata: Metadata = {
    ...METADATA['/ether'],
}

export default function Layout({ children }: PropsWithChildren) {
    return (
        <>
            <Header menu={MenuNames.ETHER} />
            <main>{children}</main>
        </>
    )
}
