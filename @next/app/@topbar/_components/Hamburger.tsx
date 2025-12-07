'use client'
import React, { useState } from 'react'
/* Components */
import Menu from '@common/components/layout/Menu'
/* Utils */
import { useDocumentClick } from '@common/hooks/useDocumentClick'
/* T_Types */
import type { MenuItem } from '@sujin/lib/types/menu'
/* Assets */
import HamburgerIcon from '@common/images/hamburger.svg'

type Props = {
    menu: MenuItem[]
    className: string
}

export default function Hamburger(props: Props) {
    const [menuOpened, setMenuOpened] = useState(false)
    const ref = useDocumentClick<HTMLDivElement>(() => {
        if (menuOpened) {
            setMenuOpened(false)
        }
    })

    return (
        <div ref={ref} className={props.className}>
            <button className="w-12" onClick={() => setMenuOpened(!menuOpened)} type="button">
                <HamburgerIcon className="fill-primary" />
            </button>
            <Menu
                callback={() => setMenuOpened(false)}
                className={`fixed top-12 w-full bg-white menu--hamburger ${menuOpened || 'hidden'}`}
                direction="vertical"
                items={props.menu}
            />
        </div>
    )
}
