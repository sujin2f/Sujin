/*
 * Related Posts Component
 * components/single/RelatedPosts
 */

import React from 'react';

import { SimplePost } from 'components/common/SimplePost';
import { ISimplePost } from 'store/items/interface/simple-post';

interface Props {
  items: ISimplePost[];
}

export const RelatedPosts = (props: Props): JSX.Element => {
  return (
    <section className="related-posts">
      <h2 className="section-header"><span>Related Posts</span></h2>

      {props.items && (
        <section className="row">
          {props.items.map((related) => (
            <SimplePost
              item={related}
              key={`related--${related.id}`}
              className="column medium-6 small-12"
            />
          ))}
        </section>
      )}
    </section>
  );
};
