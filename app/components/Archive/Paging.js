import React, { Component } from 'react';
import { withRouter } from 'react-router';

import Link from 'src/components/Link';
import PAGING from 'app/constants/paging';

class Paging extends Component {
  render() {
    const {
      totalPage,
      match: { params },
    } = this.props;

    const entities = [];
    const currentPage = parseInt(params.paged, 10) || 1;
    let url = '';

    if (totalPage !== 0) {
      const start = (currentPage - PAGING.offset) < 1 ? 1 : currentPage - PAGING.offset;
      const end = (currentPage + PAGING.offset) > totalPage
        ? totalPage :
        currentPage + PAGING.offset;

      if (start > PAGING.offset) {
        entities.push(1);
        entities.push('...');
      }

      for (let index = start; index < start + (PAGING.offset * 2) + 1 && index <= end; index += 1) {
        entities.push(index);
      }

      if (end < totalPage - PAGING.offset) {
        entities.push('...');
        entities.push(totalPage);
      }
    }

    if (params.category) {
      url = `category/${params.category}`;
    } else if (params.tag) {
      url = `tag/${params.tag}`;
    } else if (params.searchString) {
      url = `search/${params.searchString}`;
    }

    return (
      <section className="paging row">
        <div className="columns small-12">
          <ul className="pagination text-center" role="navigation" aria-label="Pagination">
            {entities.map(entity => (
              <li className={`${currentPage === entity ? 'active' : ''}`} key={`paging-${entity}`}>
                {entity !== '...' &&
                  <Link href={`${process.env.SUJIN_BASE_URL}${url}/page/${entity}`}>
                    {entity}
                  </Link>
                }
                {entity === '...' &&
                  <span className="fa fa-ellipsis-h" aria-hidden="true" />
                }
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }
}

export default withRouter(Paging);
