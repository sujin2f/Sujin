/*
 * Page Component
 * scenes/public/Page
 * domain.com/slug
 */

import React, { Fragment } from 'react';
import { useParams } from "react-router-dom";

import { Tags } from 'components/common/Tags';
import { Content } from 'components/single/Content';
import { SocialShare } from 'components/single/SocialShare';
import { RequestState, isAvailablle } from 'constants/enum';
import { NotFound } from 'scenes/public/NotFound';
import { usePost } from 'store/hooks/single';

export const Page = (): JSX.Element => {
  const { slug } = useParams();
  const post = usePost(slug);

  if (RequestState.Failed === post) {
    return (
      <NotFound />
    );
  }

  if (!isAvailablle(post)) {
    return (
      <Fragment />
    );
  }

  return (
    <Fragment>
      <div className="columns medium-12 large-2" />
      <Content post={post} className="columns large-8 medium-12">
        <Tags tags={post.tags} from={`single-${slug}`} />
        <SocialShare />
      </Content>
    </Fragment>
  );
};
