/*
 * Menu Item Component
 * components/layout/MenuItem
 */

import React, { Fragment } from 'react'

import { Link }  from 'components/common/Link'
import { MenuItem as MenuItemType } from 'store/items/menu-item'

interface Props {
  menuItem: MenuItemType
}

export const MenuItem = (props: Props): JSX.Element => {
  const {
    menuItem: {
      target,
      url,
      classes,
      title,
    },
  } = props

  return (
    <Fragment>
      {target && (
        <a
          itemType="http://schema.org/SiteNavigationElement"
          href={url || '#'}
          className={classes ? classes.join(' '): ''}
          target={target}
        >
          {title}
        </a>
      )}

      {!target && (
        <Link
          itemType="http://schema.org/SiteNavigationElement"
          to={url || '#'}
          className={classes ? classes.join(' '): ''}
        >
          {title}
        </Link>
      )}
    </Fragment>
  )
}
