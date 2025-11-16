import type { PropsWithChildren } from 'react'
import type { Metadata } from 'next/types'
/* Components */
import Wrapper from '@lib/components/Wrapper'
/* CONSTANTS */
import { METADATA } from '@lib/constants'
import { MENU_NAMES } from '@sujin/lib/constants'
/* Assets */
import './style.scss'

export const metadata: Metadata = {
    ...METADATA['/ether'],
}

export default async function Layout({ children }: PropsWithChildren) {
    return (
        <>
            <Wrapper menu={MENU_NAMES.ETHER} banner={false}>
                {children}
            </Wrapper>
        </>
    )
}
