/*
 * Menu Item Component
 * components/layout/MenuItem
 */

import React, { Fragment } from 'react'

import { Link }  from 'components/common/Link'
import { Menu } from 'store/items/menu'

interface Props {
  menuItem: Menu
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
