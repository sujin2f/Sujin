/*
 * Menu Item Component
 * components/layout/MenuItem
 */

import React, { Fragment } from 'react'

import { Link } from 'src/frontend/components'
import { MenuItem as MenuItemType } from 'src/types'

interface Props {
    menuItem: MenuItemType
}

export const MenuItem = (props: Props): JSX.Element => {
    const {
        menuItem: { target, link, htmlClass, title },
    } = props

    return (
        <Fragment>
            {target && (
                <a
                    itemType="http://schema.org/SiteNavigationElement"
                    href={link || '#'}
                    className={htmlClass ? htmlClass.join(' ') : ''}
                    target={target}
                >
                    {title}
                </a>
            )}

            {!target && (
                <Link
                    itemType="http://schema.org/SiteNavigationElement"
                    to={link || '#'}
                    className={htmlClass ? htmlClass.join(' ') : ''}
                >
                    {title}
                </Link>
            )}
        </Fragment>
    )
}
