import React, { useCallback, useState } from 'react'

/* Components */
import Menu from './Menu'
import { MenuItem } from '@sujin/lib/types/menu'
/* Helpers */
import { joinClassNames } from '@sujin/share/utils/string'
import { useDocumentClick } from '../../hooks/useDocumentClick'
import { useKeyDown } from '../../hooks/useKeyDown'
import { KeyCodes } from '@sujin/share/constants/keycode'
/* Assets */
import '../../scss/hamburger.scss'

type Props = {
    menu: MenuItem[]
    className?: string
}

/**
 * Hamburger component that renders a button to toggle a menu.
 *
 * @param {MenuItem[]} props.menu - The menu items to be displayed in the hamburger menu.
 * @param {string} [props.className] - Additional class names for the hamburger button.
 */
export const Hamburger = ({ menu, className }: Props) => {
    const [hidden, setHidden] = useState(true)
    const ref = useDocumentClick<HTMLDivElement>(() => setHidden(true))
    const onClick = useCallback(() => {
        setHidden(!hidden)
    }, [hidden])
    useKeyDown(KeyCodes.ESC, () => setHidden(true))

    return (
        <div ref={ref}>
            <button
                className={joinClassNames('hamburger', className)}
                onClick={onClick}
            >
                <div></div>
                <div></div>
                <div></div>
            </button>
            <Menu
                items={menu}
                className={joinClassNames('menu--hamburger', hidden && 'hide')}
                dropdown="click"
            />
        </div>
    )
}
