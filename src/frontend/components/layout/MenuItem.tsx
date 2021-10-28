/*
 * Menu Item Component
 * components/layout/MenuItem
 */

import React, { Fragment } from 'react'

import { Link } from 'src/frontend/components/common/Link'
import { MenuItem as MenuItemType } from 'src/types'

interface Props {
    menuItem: MenuItemType
}

export const MenuItem = (props: Props): JSX.Element => {
    const {
        menuItem: { target, url, htmlClass, title },
    } = props

    return (
        <Fragment>
            {target && (
                <a
                    itemType="http://schema.org/SiteNavigationElement"
                    href={url || '#'}
                    className={htmlClass ? htmlClass.join(' ') : ''}
                    target={target}
                >
                    {title}
                </a>
            )}

            {!target && (
                <Link
                    itemType="http://schema.org/SiteNavigationElement"
                    to={url || '#'}
                    className={htmlClass ? htmlClass.join(' ') : ''}
                >
                    {title}
                </Link>
            )}
        </Fragment>
    )
}