import React from 'react'
/* Components */
import FixedHeader from '@components/header/FixedHeader'
import SessionProvider from '@components/SessionProvider'
/* Helpers */
import { MenuNames } from '@src/constants/mysql-query'

type Props = {
    menu?: MenuNames
}

const Header = (props: Props) => {
    const menu = props.menu || MenuNames.MAIN
    return (
        <SessionProvider>
            <FixedHeader menu={menu} />
        </SessionProvider>
    )
}
export default Header
