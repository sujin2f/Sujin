/*
 * Post Component
 * scenes/public/Post
 * domain.com/2020/01/01/slug
 */

import React, { Fragment } from 'react'
import { useParams } from 'react-router-dom'

import { Link } from 'components/common/Link'
import { Tags } from 'components/common/Tags'
import { Content } from 'components/single/Content'
import { PrevNext } from 'components/single/PrevNext'
import { RelatedPosts } from 'components/single/RelatedPosts'
import { SingleAside } from 'components/single/SingleAside'
import { SocialShare } from 'components/single/SocialShare'
import { NotFound } from 'scenes/public/NotFound'
import { usePost, useLeftRail } from 'store/hooks/single'
import { Post as TypePost } from 'store/items/post'

interface Props {
  backgroundImage: string
  hideFrontFooter: boolean
  hideFrontHeader: boolean
  isPending: string
  post: TypePost
}

export const Post = (): JSX.Element => {
  const { slug } = useParams()
  const post = usePost(slug)
  const leftRail = useLeftRail()

  if (post && 'Failed' === post.state) {
    return (
      <NotFound />
    )
  }

  if (!post || 'Loading' === post.state) {
    return (
      <Fragment />
    )
  }

  const {
    prevNext,
    related,
    tags,
    title,
    excerpt,
    thumbnail,
  } = post.item!

  return (
    <Fragment>
      <div className="columns small-12 medium-3 layout__article__left">
        {Object.keys(leftRail).map((leftRailTitle: string) => (
          <Fragment key={`leftrail-${leftRailTitle}`}>
            <h2 className="section-header">
              <span>{leftRailTitle}</span>
            </h2>
            <ul className="layout__article__left__widget">
              {Object.keys(leftRail[leftRailTitle]).map((itemTitle: string) => (
                <li key={`leftrail-${leftRailTitle}-${itemTitle}`}>
                  <Link to={leftRail[leftRailTitle][itemTitle]}>
                    {itemTitle}
                  </Link>
                </li>
              ))}
            </ul>
          </Fragment>
        ))}
      </div>

      <Content post={post.item!} className="columns small-12 large-6">
        <Tags items={tags} prefix={`single-${slug}`} />
        <SocialShare
          title={title}
          excerpt={excerpt!}
          thumbnail={thumbnail!}
        />
        <PrevNext prevNext={prevNext} />
        <RelatedPosts items={related} />
      </Content>

      <aside className="columns small-12 large-3 layout__article__right">
        <SingleAside />
      </aside>
    </Fragment>
  )
}
