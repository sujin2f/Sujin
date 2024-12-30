/*
 * Menu Item Component
 * components/layout/MenuItem
 */

import React, { Fragment } from 'react'

import { Link } from 'src/frontend/components/Link'
import { useGlobalState } from 'src/frontend/hooks/global'
import { MenuItem as MenuItemType } from 'src/types/wordpress'

interface Props {
    menuItem: MenuItemType
}

export const MenuItem = (props: Props): JSX.Element => {
    const { setWrapperClass } = useGlobalState()
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
                    onClick={() =>
                        setWrapperClass({
                            'wrapper--mobile-menu': false,
                        })
                    }
                >
                    {title}
                </Link>
            )}
        </Fragment>
    )
}
