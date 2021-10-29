/*
 * Menu Component
 * components/layout/Menu
 */

import React, { Fragment } from 'react'

import { MenuItem } from 'src/frontend/components'
import { useMenu } from 'src/frontend/hooks'

interface Props {
    slug: string
    className?: string
}

export const Menu = (props: Props): JSX.Element => {
    const { slug, className } = props
    const menu = useMenu(slug)

    if (!menu || !menu.length) {
        return <Fragment />
    }

    return (
        <nav className={`${className} ${slug} menu`}>
            {menu.map((menuItem) => (
                <div key={`menu-${menuItem.id}`} className="menu__item">
                    <MenuItem menuItem={menuItem} />

                    {menuItem.children && menuItem.children.length > 0 && (
                        <nav className="children">
                            {menuItem.children.map((childItem) => (
                                <MenuItem
                                    menuItem={childItem}
                                    key={`menu-${childItem.id}`}
                                />
                            ))}
                        </nav>
                    )}
                </div>
            ))}
        </nav>
    )
}
