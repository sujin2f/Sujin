import React from 'react'
/* Components */
import FixedHeader from '@app/_components/header/FixedHeader'
import { SessionProvider } from '@app/_components/session/SessionProvider'
/* Constants */
import { MENU_NAMES } from '@app/_lib/types'
/* Assets */
import '@app/_components/header/style.scss'

type Props = {
    menu?: MENU_NAMES
}

export const Header = (props: Props) => {
    const menu = props.menu || MENU_NAMES.MAIN
    return (
        <SessionProvider>
            <FixedHeader menu={menu} />
        </SessionProvider>
    )
}
