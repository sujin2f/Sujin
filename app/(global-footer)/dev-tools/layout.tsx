import React, { PropsWithChildren } from 'react'

import { FixedHeader } from '@components/header/FixedHeader'
import { MenuNames } from '@src/constants/mysql-query'

export default function Layout({ children }: PropsWithChildren) {
    return (
        <>
            <FixedHeader menu={MenuNames.DEV_TOOL} />
            <main>{children}</main>
        </>
    )
}
