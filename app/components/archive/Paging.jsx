import Link from 'app/components/router/Link';

const { Component } = wp.element;

class Paging extends Component {
  render() {
    const {
      totalPages,
      currentPage,
      urlPrefix,
    } = this.props;

    const offset = 5;

    const entities = [];
    // let url = '';

    if (totalPages !== 0) {
      const start = (currentPage - offset) < 1 ? 1 : currentPage - offset;
      const end = (currentPage + offset) > totalPages ?
        totalPages :
        currentPage + offset;

      if (start > offset) {
        entities.push(1);
        entities.push('...');
      }

      for (let index = start; index < start + (offset * 2) + 1 && index <= end; index += 1) {
        entities.push(index);
      }

      if (end < totalPages - offset) {
        entities.push('...');
        entities.push(totalPages);
      }
    }

    return (
      <section className="paging row">
        <div className="columns small-12">
          <ul className="pagination text-center" role="navigation" aria-label="Pagination">
            {entities.map(entity => (
              <li
                className={`${parseInt(currentPage, 10) === entity ? 'active' : ''}`}
                key={`paging-${entity}`}
              >
                {entity !== '...' && (
                  <Link to={`${urlPrefix}/page/${entity}`}>
                    {entity}
                  </Link>
                )}
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

export default Paging;
