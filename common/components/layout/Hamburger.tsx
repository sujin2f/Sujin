import React, { useCallback, useState } from 'react'
import { MenuItem } from '../../types/menu'
import { className } from '../../utils/string'
import { Menu } from './Menu'
import { useDocumentClick } from '../../hooks/useDocumentClick'
import { useKeyDown } from '../../hooks/useKeyDown'
import { KeyCodes } from '../../constants/keycode'

import '../../scss/hamburger.scss'

type Props = {
    menu: MenuItem[]
    className?: string
}

export const Hamburger = (props: Props) => {
    const [hidden, setHidden] = useState(true)
    const ref = useDocumentClick<HTMLDivElement>(() => setHidden(true))
    const onClick = useCallback(() => {
        setHidden(!hidden)
    }, [hidden])
    const menuClass = className('menu--hamburger', hidden && 'hide')
    useKeyDown(KeyCodes.ESC, () => setHidden(true))

    return (
        <div ref={ref}>
            <button
                className={className('hamburger', props.className)}
                onClick={onClick}
            >
                <div></div>
                <div></div>
                <div></div>
            </button>
            <Menu items={props.menu} className={menuClass} dropdown="click" />
        </div>
    )
}
