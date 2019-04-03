import React, { Component } from 'react';

import Link from 'src/components/Link';

class Menu extends Component {
  render() {
    return (
      <ul>
        <li><Link href={`${process.env.SUJIN_BASE_URL}dev-tools`}>Case Tool</Link></li>
        <li><Link href={`${process.env.SUJIN_BASE_URL}dev-tools/text-sort`}>Text Sort</Link></li>
        <li>
          <Link href={`${process.env.SUJIN_BASE_URL}dev-tools/symbol-alignment`}>
            Symbol Alignment
          </Link>
        </li>
      </ul>
    );
  }
}

export default Menu;
