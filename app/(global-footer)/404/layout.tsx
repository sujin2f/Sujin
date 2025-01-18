import { PropsWithChildren } from 'react'

import { MenuNames } from '@src/constants/mysql-query'
import type { Metadata } from 'next/types'
import { FixedHeader } from '@components/header/FixedHeader'
import { Banner } from '@components/header/Banner'

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
        nocache: false,
    },
}

export default function WordpressLayout({ children }: PropsWithChildren) {
    return (
        <>
            <FixedHeader menu={MenuNames.MAIN} />
            <main>
                <Banner
                    menu={MenuNames.MAIN}
                    banner={{
                        title: '404 Not Found',
                        excerpt:
                            'We cannot find the result. See below for recent articles.',
                        icon: undefined,
                        prefix: undefined,
                        background: undefined,
                        backgroundColor: undefined,
                    }}
                    className=""
                />
                {children}
            </main>
        </>
    )
}
