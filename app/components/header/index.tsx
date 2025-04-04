import React from 'react'
/* Components */
import FixedHeader from '@app/components/header/FixedHeader'
import SessionProvider from '@app/components/common/SessionProvider'
/* Helpers */
import { MenuNames } from '@app/helpers/constants/mysql-query'

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
