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
import { NotFound } from 'scenes/public/NotFound';
import { usePost } from 'store/hooks/single';
import { Post as TypePost } from 'store/items/post';

interface Props {
  backgroundImage: string;
  hideFrontFooter: boolean;
  hideFrontHeader: boolean;
  isPending: string;
  post: TypePost;
}

export const Post = (): JSX.Element => {
  const { slug } = useParams();
  const post = usePost(slug);

  if (post && 'Failed' === post.state) {
    return (
      <NotFound />
    );
  }

  if (!post || 'Loading' === post.state) {
    return (
      <Fragment />
    );
  }

  const {
    prevNext,
    related,
    tags,
  } = post.item!;

  return (
    <Fragment>
      <div className="columns small-12 medium-2 layout__article__left" />

      <Content post={post.item!} className="columns small-12 large-7">
        <Tags tags={tags} from={`single-${slug}`} />
        <SocialShare />
        <PrevNext prevNext={prevNext} />
        <RelatedPosts items={related} />
      </Content>

      <aside className="columns small-12 large-3 layout__article__right">
        <SingleAside />
      </aside>
    </Fragment>
  );
};
