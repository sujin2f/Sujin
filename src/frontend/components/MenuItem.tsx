/*
 * Menu Item Component
 * components/layout/MenuItem
 */

import React, { Fragment } from 'react'

import { Link } from 'src/frontend/components'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { MenuItem as MenuItemType } from 'src/types'

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
                    href={link || '#'}
                    className={`${
                        htmlClass ? htmlClass.join(' ') : ''
                    } menu__item__link`}
                    target={target}
                >
                    {title}
                </a>
            )}

            {!target && (
                <Link
                    to={link || '#'}
                    className={`${
                        htmlClass ? htmlClass.join(' ') : ''
                    } menu__item__link`}
                >
                    {title}
                </Link>
            )}
        </Fragment>
    )
}
