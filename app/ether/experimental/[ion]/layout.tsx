import React, { type PropsWithChildren } from 'react'
/* Components */
import Header from '@app/components/header'
/* Helpers */
import { MenuNames } from '@app/helpers/constants/mysql-query'

export default async function Layout({ children }: PropsWithChildren) {
    return (
        <>
            <Header menu={MenuNames.ETHER} />
            {children}
        </>
    )
}
