/*
 * Post Component
 * scenes/public/Post
 * domain.com/2020/01/01/slug
 */

import React, { Fragment } from 'react';
import { useParams } from "react-router-dom";

import { Tags } from 'components/common/Tags';
import { Content } from 'components/single/Content';
import { PrevNext } from 'components/single/PrevNext';
import { RelatedPosts } from 'components/single/RelatedPosts';
import { SingleAside } from 'components/single/SingleAside';
import { SocialShare } from 'components/single/SocialShare';
import {
  RequestState,
  isAvailablle,
} from 'constants/enum';
import { NotFound } from 'scenes/public/NotFound';
import { usePost } from 'store/hooks/single';
import { IPost } from 'store/items/rest/interface/post';

interface Props {
  backgroundImage: string;
  hideFrontFooter: bool;
  hideFrontHeader: bool;
  isPending: string;
  post: IPost;
}

export const Post = (): JSX.Element => {
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

  const {
    prevNext,
    related,
    tags,
  } = post;

  return (
    <Fragment>
      <div className="columns medium-2 layout__article__left" />

      <Content post={post} className="columns large-7 medium-12">
        <Tags tags={tags} from={`single-${slug}`} />
        <SocialShare />
        <PrevNext prevNext={prevNext} />
        <RelatedPosts items={related} />
      </Content>

      <aside className="columns large-3 layout__article__right">
        <SingleAside />
      </aside>
    </Fragment>
  );
};
