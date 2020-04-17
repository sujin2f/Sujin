/*
 * Menu Component
 * components/layout/Menu
 */

import React, { Fragment } from 'react';

import { isAvailablle } from 'constants/enum';
import { MenuItem } from 'components/layout/MenuItem';
import { useMenu } from 'store/hooks/menu';

interface Props {
  slug: string;
  className?: string;
}

export const Menu = (props: Props): JSX.Element => {
  const { slug, className } = props;
  const menu = useMenu(slug);

  if (!isAvailablle(menu)) {
    return (
      <Fragment />
    );
  }

  return (
    <nav className={`${className} ${slug} menu`}>
      {menu.map((menuItem: IMenu) => (
        <div key={`menu-${menuItem.ID}`} className="menu__item">
          <MenuItem menuItem={menuItem} />

          {menuItem.children.length > 0 && (
            <nav className="children">
              {menuItem.children.map((childItem: IMenu) => (
                <MenuItem
                  menuItem={childItem}
                  key={`menu-${childItem.ID}`}
                />
              ))}
            </nav>
          )}
        </div>
      ))}
    </nav>
  );
}
