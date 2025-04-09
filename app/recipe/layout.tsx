/**
 * Testing library for diagram build
 */

import { AdminWrapperServer } from '@app/_components/session/AdminWrapperServer'
import { PropsWithChildren } from 'react'

export default function Layout({ children }: PropsWithChildren) {
    return <AdminWrapperServer>{children}</AdminWrapperServer>
}
