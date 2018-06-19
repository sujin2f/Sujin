import React, { Component } from 'react';

import Link from 'src/components/Link';

import { getLink } from 'app/utils/common';

class PrevNext extends Component {
  render() {
    const { prevnext } = this.props;

    return (
      <nav>
        {prevnext &&
        <ul className="row" id="single-pager">
          {prevnext.prev &&
          <li className="small-12 medium-6 columns prev">
            <Link href={getLink(prevnext.prev.router_link)}>
              <i className="fa fa-chevron-left" aria-hidden="true" />
              <span>{prevnext.prev.title.rendered}</span>
            </Link>
          </li>
          }
          {!prevnext.prev &&
          <li className="small-12 medium-6 columns prev" />
          }
          {prevnext.next &&
          <li className="small-12 medium-6 columns next">
            <Link href={getLink(prevnext.next.router_link)}>
              <i className="fa fa-chevron-right" aria-hidden="true" />
              <span>{prevnext.next.title.rendered}</span>
            </Link>
          </li>
          }
        </ul>
        }
      </nav>
    );
  }
}

export default PrevNext;
