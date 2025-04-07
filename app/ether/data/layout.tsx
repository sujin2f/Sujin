import type { PropsWithChildren } from 'react'
import type { Metadata } from 'next/types'
/* Components */
import { Header } from '@app/_components/header'
/* Constants */
import { METADATA } from '@app/_lib/constants'
import { MENU_NAMES } from '@app/_lib/types'
/* Assets */
import './style.scss'

export const metadata: Metadata = {
    ...METADATA['/ether'],
}

export default function Layout({ children }: PropsWithChildren) {
    return (
        <>
            <Header menu={MENU_NAMES.ETHER} />
            <main>{children}</main>
        </>
    )
}
