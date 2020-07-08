/*
 * Menu Component
 * components/layout/Menu
 */

import React, { Fragment } from 'react';

import { MenuItem } from 'components/layout/MenuItem';
import { useMenu } from 'store/hooks/menu';
import { MenuItem as MenuItemType } from 'store/items/menu-item';

interface Props {
  slug: string;
  className?: string;
}

export const Menu = (props: Props): JSX.Element => {
  const { slug, className } = props;
  const menu = useMenu(slug);

  if (!menu || 'Success' !== menu.state) {
    return (
      <Fragment />
    );
  }

  return (
    <nav className={`${className} ${slug} menu`}>
      {menu.item!.map((menuItem: MenuItemType) => (
        <div key={`menu-${menuItem.ID}`} className="menu__item">
          <MenuItem menuItem={menuItem} />

          {menuItem.children && menuItem.children.length > 0 && (
            <nav className="children">
              {menuItem.children.map((childItem: MenuItemType) => (
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
