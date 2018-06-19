import React, { Component } from 'react';

import Link from 'src/components/Link';

class Menu extends Component {
  render() {
    const { menu, className, position } = this.props;

    return (
      <ul className={`${className || ''} menu`}>
        {
          menu.length !== 0 &&
          menu.map(m => (
            <li
              key={`menu-${position}-${m.title}`}
              itemType="http://schema.org/SiteNavigationElement"
              >
              <Link href={m.url}>{m.title}</Link>
            </li>
          ))
        }
      </ul>
    );
  }
}

export default Menu;
