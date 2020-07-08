/*
 * Page Component
 * scenes/public/Page
 * domain.com/slug
 */

import React, { Fragment } from 'react'
import { useParams } from 'react-router-dom'

import { Tags } from 'components/common/Tags'
import { Content } from 'components/single/Content'
import { SocialShare } from 'components/single/SocialShare'
import { NotFound } from 'scenes/public/NotFound'
import { usePost } from 'store/hooks/single'

export const Page = (): JSX.Element => {
  const { slug } = useParams()
  const post = usePost(slug)

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
    tags,
    title,
    excerpt,
    thumbnail,
  } = post.item!

  return (
    <Fragment>
      <div className="columns medium-12 large-2" />
      <Content post={post.item!} className="columns large-8 medium-12">
        <Tags items={tags} prefix={`single-${slug}`} />
        <SocialShare
          title={title}
          excerpt={excerpt!}
          thumbnail={thumbnail!}
        />
      </Content>
    </Fragment>
  )
}
