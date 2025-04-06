import React, { type PropsWithChildren } from 'react'
/* Components */
import { Header } from '@app/_components/header'
/* Helpers */
import { MenuNames } from '@app/_lib/data/mysql/constants'

export default async function Layout({ children }: PropsWithChildren) {
    return (
        <>
            <Header menu={MenuNames.ETHER} />
            {children}
        </>
    )
}
