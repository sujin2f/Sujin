import type { PropsWithChildren } from 'react'
import type { Metadata } from 'next/types'
/* Components */
import Row from '@common/components/layout/Row'
import Column from '@common/components/layout/Column'
/* CONSTANTS */
import { METADATA } from '@lib/constants'

export const metadata: Metadata = {
    ...METADATA['/ether'],
}

export default async function Layout({ children }: PropsWithChildren) {
    return (
        <>
            <Row>
                <Column small={12}>{children}</Column>
            </Row>
        </>
    )
}
