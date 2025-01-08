import React, { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { MenuItem as TypeMenuItem } from '@common/types/menu'
import { className } from '@common/utils/string'

import Arrow from '@common/images/icons/arrow_drop_up.svg'

import 'src/common/scss/menu.scss'

type ComponentProps = {
    readonly className?: string
    readonly dropdown?: 'hover' | 'click'
    readonly items: TypeMenuItem[]
    readonly direction?: 'vertical' | 'horizontal'
    readonly callback?: () => void
}

type BlockProps = {
    readonly dropdown?: 'hover' | 'click'
    readonly items: TypeMenuItem[]
    readonly direction: 'vertical' | 'horizontal'
    readonly callback?: () => void
}

type ItemProps = {
    readonly item: TypeMenuItem
    readonly dropdown?: 'hover' | 'click'
    readonly direction: 'vertical' | 'horizontal'
    readonly callback?: () => void
}

function MenuItem(props: ItemProps) {
    const hasChildren = props.item.children && props.item.children.length > 0
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
            className={classNames}
            onClick={onClick}
            onFocus={onMouseOver}
            onMouseLeave={onMouseLeave}
            onMouseOver={onMouseOver}
        >
            <Link className="menu__link" onClick={props.callback} to={linkTo}>
                {props.item.title}

                {props.dropdown && hasChildren ? (
                    <Arrow className="menu__link__arrow" />
                ) : null}
            </Link>

            {hasChildren ? (
                <MenuBlock
                    callback={props.callback}
                    direction={props.direction}
                    items={props.item.children || []}
                />
            ) : null}
        </li>
    )
}

function MenuBlock(props: BlockProps) {
    return (
        <ul className="menu">
            {props.items.map((menu, index) => (
                <MenuItem
                    callback={props.callback}
                    direction={props.direction}
                    dropdown={props.dropdown}
                    item={menu}
                    key={`menu-${menu.title}-${index}`}
                />
            ))}
        </ul>
    )
}

export function Menu(props: ComponentProps) {
    const direction = useMemo(
        () => props.direction || 'horizontal',
        [props.direction],
    )
    const cls = useMemo(
        () =>
            className(
                'menu__container',
                `menu__container--${direction}`,
                props.className,
            ),
        [direction, props.className],
    )
    const dropdown = useMemo(
        () =>
            direction === 'horizontal' && !props.dropdown
                ? 'hover'
                : props.dropdown,
        [direction, props.dropdown],
    )

    return (
        <nav className={cls}>
            <MenuBlock
                callback={props.callback}
                direction={direction}
                dropdown={dropdown}
                items={props.items}
            />
        </nav>
    )
}
