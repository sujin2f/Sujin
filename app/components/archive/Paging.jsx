import hash from 'object-hash';

import Link from 'app/components/router/Link';

import { getPaging } from 'app/utils/archive';

const { Component } = wp.element;

class Paging extends Component {
  render() {
    const {
      totalPages,
      currentPage,
      urlPrefix,
    } = this.props;

    const entities = getPaging(totalPages, currentPage, 5);

    return (
      <section className="paging row">
        <div className="columns small-12">
          <ul className="pagination text-center" role="navigation" aria-label="Pagination">
            {entities.map((entity, id) => {
              const url = `${urlPrefix}/page/${entity}`;
              return (
                <li
                  className={`${parseInt(currentPage, 10) === entity ? 'active' : ''}`}
                  key={hash(`url-${id}`)}
                >
                  {entity !== '...' && (
                    <Link to={url}>
                      {entity}
                    </Link>
                  )}
                  {entity === '...' &&
                    <span className="fa fa-ellipsis-h" aria-hidden="true" />
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
