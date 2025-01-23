import React, { PropsWithChildren, Suspense } from 'react'

import { FixedHeader } from '@components/header/FixedHeader'
import { MenuNames } from '@src/constants/mysql-query'
import Loading from '@app/loading'

export default function Layout({ children }: PropsWithChildren) {
    return (
        <>
            <FixedHeader menu={MenuNames.DEV_TOOL} />
            <Suspense fallback={<Loading menu={MenuNames.DEV_TOOL} />}>
                <main>{children}</main>
            </Suspense>
        </>
    )
}
