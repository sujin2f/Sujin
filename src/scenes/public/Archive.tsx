/*
 * Archive Component
 * scenes/public/Archive
 *
 * //domain.com/category/blog
 * //domain.com/tag/blog
 * //domain.com/search/blog
 */

import React, { Fragment } from 'react';
import { useParams } from "react-router-dom";

import { Paging } from 'components/common/Paging';
import { SimplePost } from 'components/common/SimplePost';
import {
  RequestState,
  isAvailablle,
} from 'constants/enum';
import { NotFound } from 'scenes/public/NotFound';
import { useArchive } from 'store/hooks/archive';
import { ISimplePost } from 'store/items/interface/simple-post';

export const Archive = (): JSX.Element => {
  const { type, slug, page } = useParams();
  const archive = useArchive(type, slug, page);

  if (RequestState.Failed === archive) {
    return (
      <NotFound />
    );
  }

  if (!isAvailablle(archive)) {
    return (
      <Fragment />
    );
  }

  return (
    <Fragment>
      {archive.items && archive.items.length > 0 && (
        <Fragment>
          {archive.items.map((item: ISimplePost) => (
            <SimplePost
              className="columns large-4 medium-6 small-12 archive__item"
              key={`${type}-${slug}-${page}-${item.id}`}
              item={item}
            />
          ))}

          <Paging
            totalPages={archive.totalPages}
            currentPage={parseInt(page, 10) || 1}
            urlPrefix={`/${type}/${slug}`}
          />
        </Fragment>
      )}
    </Fragment>
    );
};
