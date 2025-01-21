'use client'

import React, { RefObject, useCallback, useMemo, useState } from 'react'
import Link from 'next/link'

/* Helpers */
import type { MenuItem as TypeMenuItem } from '../../types/menu'
import { joinClassNames } from '../../utils/string'
/* Assets */
import Arrow from '../../images/icons/arrow_drop_up.svg'
import '../../scss/menu.scss'

type Props = {
    readonly className?: string
    readonly dropdown?: 'hover' | 'click'
    readonly items: TypeMenuItem[]
    readonly direction?: 'vertical' | 'horizontal'
    readonly callback?: () => void
    readonly ref?: RefObject<HTMLElement | null>
}

/**
 * Menu component that renders a navigation menu with various styles and behaviors.
 *
 * @param {MenuItem[]} props.items - The menu items to be displayed.
 * @param {'horizontal' | 'vertical'} [props.direction] - The direction of the menu.
 * @param {'hover' | 'click'} [props.dropdown] - The dropdown behavior of the menu.
 * @param {string} [props.className] - Additional class names for the menu container.
 * @param {() => void} [props.callback] - Callback function to handle menu item clicks.
 * @param {React.Ref<HTMLDivElement>} [props.ref] - The ref object for the menu container.
 */
export function Menu({
    items,
    direction: propDirection,
    dropdown: propDropdown,
    className,
    ref,
    callback,
}: Props) {
    const direction = propDirection || 'horizontal'
    const dropdown =
        direction === 'horizontal' && !propDropdown ? 'hover' : propDropdown

    return (
        <nav
            className={joinClassNames(
                'menu__container',
                `menu__container--${direction}`,
                className,
            )}
            ref={ref}
        >
            <MenuBlock
                callback={callback}
                direction={direction}
                dropdown={dropdown}
                items={items}
            />
        </nav>
    )
}

type BlockProps = {
    readonly items: TypeMenuItem[]
    readonly dropdown?: 'hover' | 'click'
    readonly direction: 'vertical' | 'horizontal'
    readonly callback?: () => void
}

function MenuBlock({ items, dropdown, direction, callback }: BlockProps) {
    return (
        <ul className="menu">
            {items.map((menu, index) => (
                <MenuItem
                    callback={callback}
                    direction={direction}
                    dropdown={dropdown}
                    item={menu}
                    key={`menu-${menu.title}-${index}`}
                />
            ))}
        </ul>
    )
}

type ItemProps = {
    readonly item: TypeMenuItem
    readonly dropdown?: 'hover' | 'click'
    readonly direction: 'vertical' | 'horizontal'
    readonly callback?: () => void
}

function MenuItem({ item, dropdown, direction, callback }: ItemProps) {
    const hasChildren = item.children && item.children.length > 0
    const [closed, changeClosed] = useState(
        hasChildren && dropdown ? true : false,
    )

    const onMouseOver = useCallback(() => {
        if (dropdown === 'hover') {
            changeClosed(false)
        }
    }, [dropdown])

    const onMouseLeave = useCallback(() => {
        if (dropdown === 'hover') {
            changeClosed(true)
        }
    }, [dropdown])

    const onClick = useCallback(() => {
        if (dropdown === 'click') {
            changeClosed(!closed)
        }
    }, [dropdown, closed])

    const linkTo = useMemo(() => {
        if (hasChildren) {
            return ''
        }
        return item.link
    }, [item.link, hasChildren])

    return (
        <li
            className={joinClassNames(
                'menu__item',
                closed && 'menu__item--closed',
                hasChildren && !closed && 'menu__item--opened',
                hasChildren && 'menu__item--children',
            )}
            onClick={onClick}
            onFocus={onMouseOver}
            onMouseLeave={onMouseLeave}
            onMouseOver={onMouseOver}
        >
            <Link
                className="menu__link"
                onClick={callback}
                href={linkTo}
                target={item.target}
            >
                {item.title}

                {dropdown && hasChildren ? (
                    <Arrow className="menu__link__arrow" />
                ) : null}
            </Link>

            {hasChildren ? (
                <MenuBlock
                    callback={callback}
                    direction={direction}
                    items={item.children || []}
                />
            ) : null}
        </li>
    )
}
