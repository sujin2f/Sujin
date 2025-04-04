import React from 'react'
/* Components */
import FixedHeader from '@app/_components/header/FixedHeader'
import SessionProvider from '@app/_components/SessionProvider'
/* Helpers */
import { MenuNames } from '@app/_lib/data/mysql/constants'
/* Assets */
import '@app/_components/header/style.scss'

type Props = {
    menu?: MenuNames
}

export const Header = (props: Props) => {
    const menu = props.menu || MenuNames.MAIN
    return (
        <SessionProvider>
            <FixedHeader menu={menu} />
        </SessionProvider>
    )
}
