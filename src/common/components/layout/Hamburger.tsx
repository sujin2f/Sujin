import React, { useCallback, useState } from 'react'
import { MenuItem } from 'src/common/types/menu'
import { className } from 'src/common/utils/string'
import { Menu } from './Menu'
import { useDocumentClick } from 'src/common/hooks/useDocumentClick'
import { useEscapeKey } from 'src/common/hooks/useEscapeKey'

require('src/common/scss/hamburger.scss')

type Props = {
    menu: MenuItem[]
    className?: string
}

export const Hamburger = (props: Props): JSX.Element => {
    const [hidden, setHidden] = useState(true)
    const ref = useDocumentClick<HTMLDivElement>(() => setHidden(true))
    const onClick = useCallback(() => {
        setHidden(!hidden)
    }, [hidden])
    const menuClass = className('menu--hamburger', hidden && 'hide')
    useEscapeKey(() => setHidden(true))

    return (
        <div ref={ref}>
            <div
                className={className('hamburger', props.className)}
                onClick={onClick}
            >
                <div></div>
                <div></div>
                <div></div>
            </div>
            <Menu items={props.menu} className={menuClass} dropdown="click" />
        </div>
    )
}
