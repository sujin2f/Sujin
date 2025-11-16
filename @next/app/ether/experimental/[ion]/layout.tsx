import type { PropsWithChildren } from 'react'
/* Components */
import Wrapper from '@lib/components/Wrapper'
import { AdminWrapperServer } from '@app/_components/AdminWrapperServer'
/* CONSTANTS */
import { MENU_NAMES } from '@sujin/lib/constants'

export default async function Layout({ children }: PropsWithChildren) {
    return (
        <AdminWrapperServer>
            <Wrapper menu={MENU_NAMES.ETHER} banner={false}>
                {children}
            </Wrapper>
        </AdminWrapperServer>
    )
}
