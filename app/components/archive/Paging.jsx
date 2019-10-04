import hash from 'object-hash';

import Link from 'app/components/router/Link';

import { getPaging } from 'app/utils/archive';
import { isMobile } from 'app/utils/common';

const { Component } = wp.element;

class Paging extends Component {
  render() {
    const {
      totalPages,
      currentPage,
      urlPrefix,
    } = this.props;

    const pagingRange = isMobile() ? 1 : 5;
    const entities = getPaging(totalPages, currentPage, pagingRange);

    return (
      <section className="paging row">
        <div className="columns small-12">
          <ul className="pagination text-center" role="navigation" aria-label="Pagination">
            {entities.map((entity, id) => {
              const url = `${urlPrefix}/page/${entity}`;
              const isCurrnet = parseInt(currentPage, 10) === entity;
              return (
                <li
                  className={`${isCurrnet ? 'active' : ''}`}
                  key={hash(`url-${id}`)}
                >
                  {entity !== '...' && isCurrnet && (
                    <span>{entity}</span>
                  )}

                  {entity !== '...' && !isCurrnet && (
                    <Link to={url}>
                      {entity}
                    </Link>
                  )}

                  {entity === '...' &&
                    <span>&hellip;</span>
                  }
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    );
  }
}

export default Paging;
