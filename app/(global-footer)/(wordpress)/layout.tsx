import React, { PropsWithChildren, Suspense } from 'react'

import { FixedHeader } from '@components/header/FixedHeader'
import { MenuNames } from '@src/constants/mysql-query'
import Loading from '@app/loading'

export default function Layout({ children }: PropsWithChildren) {
    return (
        <>
            <FixedHeader menu={MenuNames.MAIN} />
            <Suspense fallback={<Loading menu={MenuNames.MAIN} />}>
                <main>{children}</main>
            </Suspense>
        </>
    )
}
