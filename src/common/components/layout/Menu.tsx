import React, { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { MenuItem as TypeMenuItem } from 'src/common/types/menu'
import { className, generateUUID } from 'src/common/utils/string'
import Arrow from 'src/common/images/icons/arrow_drop_up.svg'

require('src/common/scss/menu.scss')

type ComponentProps = {
    className?: string
    dropdown?: 'hover' | 'click'
    items: TypeMenuItem[]
    direction?: 'vertical' | 'horizontal'
}

type BlockProps = {
    dropdown?: 'hover' | 'click'
    items: TypeMenuItem[]
    direction: 'vertical' | 'horizontal'
}

type ItemProps = {
    item: TypeMenuItem
    dropdown?: 'hover' | 'click'
    direction: 'vertical' | 'horizontal'
}

const MenuItem = (props: ItemProps): JSX.Element => {
    const hasChildren = !!props.item.children
    const [closed, changeClosed] = useState(
        hasChildren && props.dropdown ? true : false,
    )

    const onMouseOver = useCallback(() => {
        if (props.dropdown === 'hover') {
            changeClosed(false)
        }
    }, [props.dropdown])

    const onMouseLeave = useCallback(() => {
        if (props.dropdown === 'hover') {
            changeClosed(true)
        }
    }, [props.dropdown])

    const onClick = useCallback(() => {
        if (props.dropdown === 'click') {
            changeClosed(!closed)
        }
    }, [props.dropdown, closed])

    const linkTo = useMemo(() => {
        if (hasChildren) {
            return ''
        }
        return props.item.link
    }, [props.item.link, hasChildren])

    const classNames = useMemo(
        () =>
            className(
                'menu__item',
                closed && 'menu__item--closed',
                hasChildren && !closed && 'menu__item--opened',
                hasChildren && 'menu__item--children',
            ),
        [closed, hasChildren],
    )

    return (
        <li
            onMouseOver={onMouseOver}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
            className={classNames}
        >
            <Link to={linkTo} className="menu__link">
                {props.item.title}
                {props.dropdown && props.item.children && (
                    <Arrow className="menu__link__arrow" />
                )}
            </Link>

            {props.item.children && (
                <MenuBlock
                    items={props.item.children}
                    direction={props.direction}
                />
            )}
        </li>
    )
}

const MenuBlock = (props: BlockProps): JSX.Element => {
    return (
        <ul className="menu">
            {props.items.map((menu) => (
                <MenuItem
                    key={`menu-${menu.title}-${generateUUID()}`}
                    item={menu}
                    dropdown={props.dropdown}
                    direction={props.direction}
                />
            ))}
        </ul>
    )
}

export const Menu = (props: ComponentProps): JSX.Element => {
    const direction = props.direction || 'horizontal'
    const cls = className(
        'menu__container',
        `menu__container--${direction}`,
        props.className,
    )
    const dropdown =
        direction === 'horizontal' && !props.dropdown ? 'hover' : props.dropdown
    return (
        <nav className={cls}>
            <MenuBlock
                dropdown={dropdown}
                items={props.items}
                direction={direction}
            />
        </nav>
    )
}
