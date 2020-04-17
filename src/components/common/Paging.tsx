import React, { Fragment } from 'react';

import { Link } from "components/common/Link";
import { PAGE_OFFSET } from 'constants/common';

interface Props {
  item: ISimplePost;
  columns?: string;
  thumbnailKey?: {
    desktop?: string;
    mobile?: string;
  };
}

export const Paging = (props: Props): JSX.Element => {
  const {
    totalPages = 1,
    urlPrefix,
    currentPage,
  } = props;

  let entities = [];

  if (totalPages !== 1) {
    const start = (currentPage - PAGE_OFFSET) > 2 ? currentPage - PAGE_OFFSET : 1;
    const end = (currentPage + PAGE_OFFSET) < (totalPages - 1) ?
      currentPage + PAGE_OFFSET :
      totalPages;

    if (start > 2) {
      entities.push(1);
      entities.push(-1);
    }

    entities = [
      ...entities,
      ...Array.from(Array(end - start + 1).keys()).map((v) => v + start),
    ];

    if (end < totalPages - 1) {
      entities.push(-1);
      entities.push(totalPages);
    }
  }

  return (
    <nav className="columns small-12 paging" role="navigation" aria-label="Paging">
      {entities.map((entity) => {
        const url = `${urlPrefix}/page/${entity}`;
        const isCurrnet = parseInt(currentPage, 10) === entity;
        return (
          <Fragment key={`paging-${entity}`}>
            {isCurrnet && (
              <span className="active">{entity}</span>
            )}

            {entity !== -1 && !isCurrnet && (
              <Link to={url}>
                {entity}
              </Link>
            )}

            {entity === -1 && (
              <div className="hellip">
                <span />
                <span />
                <span />
              </div>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
};
