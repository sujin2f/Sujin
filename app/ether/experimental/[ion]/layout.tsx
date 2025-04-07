import type { PropsWithChildren } from 'react'
/* Components */
import { Header } from '@app/_components/header'
import { AdminWrapperServer } from '@app/_components/session/AdminWrapperServer'
/* Constants */
import { MENU_NAMES } from '@app/_lib/types'

export default async function Layout({ children }: PropsWithChildren) {
    return (
        <AdminWrapperServer>
            <Header menu={MENU_NAMES.ETHER} />
            {children}
        </AdminWrapperServer>
    )
}
