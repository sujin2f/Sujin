import React from 'react'
/* Components */
import FixedHeader from '@components/header/FixedHeader'
/* Helpers */
import { MenuNames } from '@src/constants/mysql-query'
import { getPathName } from '@src/utils/server'
import { getMenuNameFromPath } from '@src/utils/system'

const Header = async () => {
    const path = await getPathName()
    if (path?.startsWith('/ether/data')) {
        return <FixedHeader menu={MenuNames.ETHER} className="top-bar--ether" />
    }

    const menu = getMenuNameFromPath(path)
    return <FixedHeader menu={menu} />
}
export default Header
