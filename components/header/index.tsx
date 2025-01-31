'use client'
import React from 'react'

import { FixedHeader } from '@components/header/FixedHeader'
import { MenuNames } from '@src/constants/mysql-query'
import { usePathname } from 'next/navigation'

export default function Header() {
    const path = usePathname()

    if (path?.startsWith('/ether/kor')) {
        return <FixedHeader menu={MenuNames.ETHER_KOR} />
    }

    if (path?.startsWith('/ether/data')) {
        return <FixedHeader menu={MenuNames.ETHER} className="top-bar--ether" />
    }

    if (path?.startsWith('/ether')) {
        return <FixedHeader menu={MenuNames.ETHER} />
    }

    if (path?.startsWith('/dev-tools')) {
        return <FixedHeader menu={MenuNames.DEV_TOOL} />
    }

    return <FixedHeader menu={MenuNames.MAIN} />
}
