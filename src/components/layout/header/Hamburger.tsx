'use client'

import React, { useState } from 'react'

import HamburgerIcon from '@src/images/hamburger.svg'
import { Menu } from '@common/components/layout/Menu'
import { useDocumentClick } from '@common/hooks/useDocumentClick'
import { useMenu } from '@src/hooks/useMenu'
import { MenuNames } from '@src/constants/mysql-query'

export function Hamburger() {
    const { menu } = useMenu(MenuNames.MAIN)
    const [menuOpened, setMenuOpened] = useState(false)
    const toggleMenu = () => setMenuOpened(!menuOpened)
    const ref = useDocumentClick<HTMLElement>(() => {
        if (menuOpened) {
            toggleMenu()
        }
    })

    return (
        <>
            <button
                className="hide-for-large hamburger"
                onClick={toggleMenu}
                type="button"
            >
                <HamburgerIcon />
            </button>
            <Menu
                callback={toggleMenu}
                className={`hide-for-large top-bar__menu__container--mobile ${menuOpened || 'hide'}`}
                direction="vertical"
                items={menu}
                ref={ref}
            />
        </>
    )
}
