import type { PropsWithChildren } from 'react'
import type { Metadata } from 'next/types'
/* Components */
import Wrapper from '@app/_components/Wrapper'
/* CONSTANTS */
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
            <Wrapper menu={MENU_NAMES.ETHER} banner={false}>
                {children}
            </Wrapper>
        </>
    )
}
