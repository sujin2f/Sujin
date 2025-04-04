'use client'
import React, { useCallback, useState } from 'react'
/* Components */
import { Menu } from '@common/components/layout/Menu'
/* Helpers */
import { useDocumentClick } from '@common/hooks/useDocumentClick'
import type { MenuItem } from '@src/types/wordpress'
/* Assets */
import HamburgerIcon from '@src/images/hamburger.svg'

type Props = {
    menu: MenuItem[]
}

export default function Hamburger(props: Props) {
    // Click outside
    const ref = useDocumentClick<HTMLElement>(() => {
        if (menuOpened) {
            toggleMenu()
        }
    })

    // Open/Close menu
    const [menuOpened, setMenuOpened] = useState(false)
    const toggleMenu = useCallback(
        () => setMenuOpened(!menuOpened),
        [menuOpened],
    )

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
                className={`hide-for-large top-bar__menu__container--mobile ${
                    menuOpened || 'hide'
                }`}
                direction="vertical"
                items={props.menu}
                ref={ref}
            />
        </>
    )
}
