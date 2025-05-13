import type { PropsWithChildren } from 'react'
/* Components */
import Wrapper from '@app/_components/Wrapper'
import { AdminWrapperServer } from '@app/_components/AdminWrapperServer'
/* CONSTANTS */
import { MENU_NAMES } from '@app/_lib/types'

export default async function Layout({ children }: PropsWithChildren) {
    return (
        <AdminWrapperServer>
            <Wrapper menu={MENU_NAMES.ETHER} banner={false}>
                {children}
            </Wrapper>
        </AdminWrapperServer>
    )
}
