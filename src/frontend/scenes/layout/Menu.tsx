import React, { Fragment } from 'react'

import { MenuItem } from 'src/frontend/scenes/layout/MenuItem'
import { useMenu } from 'src/frontend/hooks/useMenu'

interface Props {
    slug: string
    className?: string
    isDevTool?: boolean
}

export const Menu = (props: Props): JSX.Element => {
    const { slug, className } = props
    const { menu, error, loading } = useMenu(props.isDevTool ? 'devtool' : slug)

    if (error || loading) {
        return <Fragment />
    }

    return (
        <nav className={`${className} ${slug} menu`}>
            {menu.map((menuItem) => (
                <div key={`menu-${menuItem.id}`} className="menu__item">
                    <MenuItem menuItem={menuItem} />

                    {menuItem.children && menuItem.children.length > 0 && (
                        <nav className="menu--children">
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
