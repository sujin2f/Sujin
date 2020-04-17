/** components/widgets/RecentPosts */
import React, { Fragment } from 'react';

import { SimplePost } from 'components/common/SimplePost';
import { isAvailablle } from 'constants/enum';
import { useArchive } from 'store/hooks/archive';
import { ISimplePost } from 'store/items/rest/interface/simple-post';

export const RecentPosts = (props: Props): JSX.Element => {
  const archive = useArchive('recentPosts', 'recentPosts', 1, false);

  if (!isAvailablle(archive)) {
    return (
      <Fragment />
    );
  }

  return (
    <section className="widget recent-posts row">
      {archive.items.map((item: ISimplePost) => (
        <SimplePost
          key={`recent-post-id-${item.slug}`}
          columns="large-12 medium-6 small-6"
          item={item}
          thumbnailKey={{ desktop: 'small', mobile: 'small' }}
        />
      ))}
    </section>
  );
};
