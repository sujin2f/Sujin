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
import { NotFound } from 'scenes/public/NotFound';
import { useArchive } from 'store/hooks/archive';
import { SimplePost as SimplePostType } from 'store/items/simple-post';

export const Archive = (): JSX.Element => {
  const { type, slug, page } = useParams();
  const archive = useArchive(type, slug, (page || 1));

  if (archive && 'Failed' === archive.state) {
    return (
      <NotFound />
    );
  }

  if (!archive || 'Loading' === archive.state) {
    return (
      <Fragment />
    );
  }

  return (
    <Fragment>
      {archive.item && archive.item.items && archive.item.items.length > 0 && (
        <Fragment>
          {archive.item.items.map((item: SimplePostType) => (
            <SimplePost
              className="columns large-4 medium-6 small-12 archive__item"
              key={`${type}-${slug}-${page}-${item.id}`}
              item={item}
            />
          ))}

          <Paging
            totalPages={archive.item.totalPages ? archive.item.totalPages : 0}
            currentPage={parseInt(page, 10) || 1}
            urlPrefix={`/${type}/${slug}`}
          />
        </Fragment>
      )}
    </Fragment>
    );
};
