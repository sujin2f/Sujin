import React from 'react'
/* Components */
import FixedHeader from '@components/header/FixedHeader'
import SessionProvider from '@components/SessionProvider'
/* Helpers */
import { MenuNames } from '@src/constants/mysql-query'
import { getPathName } from '@src/utils/server'
import { getMenuNameFromPath } from '@src/utils/system'

const Header = async () => {
    const path = await getPathName()
    if (path?.startsWith('/ether/data')) {
        return (
            <SessionProvider>
                <FixedHeader
                    menu={MenuNames.ETHER}
                    className="top-bar--ether"
                />
            </SessionProvider>
        )
    }

    const menu = getMenuNameFromPath(path)
    return (
        <SessionProvider>
            <FixedHeader menu={menu} />
        </SessionProvider>
    )
}
export default Header
