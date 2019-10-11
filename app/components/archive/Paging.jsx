import hash from 'object-hash';

import Link from 'app/components/router/Link';

const { Component } = wp.element;

class Paging extends Component {
  render() {
    const {
      entities,
      urlPrefix,
      currentPage,
    } = this.props;

    return (
      <section className="paging row">
        <div className="columns small-12">
          <ul className="pagination text-center" role="navigation" aria-label="Pagination">
            {entities.map((entity, id) => {
              const url = `${urlPrefix}/page/${entity}`;
              const isCurrnet = currentPage === entity;
              return (
                <li
                  className={`${isCurrnet ? 'active' : ''}`}
                  key={hash(`url-${id}`)}
                >
                  {isCurrnet && (
                    <span>{entity}</span>
                  )}

                  {entity !== -1 && !isCurrnet && (
                    <Link to={url}>
                      {entity}
                    </Link>
                  )}

                  {entity === -1 && (
                    <span>&hellip;</span>
                  )}
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
