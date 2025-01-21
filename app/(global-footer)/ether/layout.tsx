import React, { PropsWithChildren } from 'react'

import { FixedHeader } from '@components/header/FixedHeader'
import { MenuNames } from '@src/constants/mysql-query'

import '@src/scss/ether-data.scss'

export default function Layout({ children }: PropsWithChildren) {
    return (
        <>
            <FixedHeader menu={MenuNames.ETHER} className="top-bar--ether" />
            {children}
        </>
    )
}
