import React, { type PropsWithChildren } from 'react'
/* Components */
import { Header } from '@app/_components/header'
import { AdminWrapperServer } from '@app/_components/session/AdminWrapperServer'
/* Helpers */
import { MenuNames } from '@app/_lib/data/mysql/constants'

export default async function Layout({ children }: PropsWithChildren) {
    return (
        <AdminWrapperServer>
            <Header menu={MenuNames.ETHER} />
            {children}
        </AdminWrapperServer>
    )
}
