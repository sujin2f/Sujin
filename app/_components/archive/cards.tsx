import React from 'react'
/* Components */
import { Column } from '@common/components/layout/Column'
import { Card } from '@common/components/containers/Card'
import { Tags } from '@app/_components/single/Tags'
/* Helpers */
import type { ColumnProps } from '@common/components/layout/Column'
import { getThumbnailFromPost } from '@app/_lib/data/mysql/utils'
import { ARCHIVE, IMAGE_SIZE, T_ArchivePost } from '@app/_lib/types'
import Row from '@common/components/layout/Row'

type Props = ColumnProps & {
    readonly posts: T_ArchivePost[]
    readonly keyPrefix: string
    readonly imageSize?: IMAGE_SIZE
}

export const Cards = ({
    posts,
    keyPrefix,
    imageSize = IMAGE_SIZE.POST_THUMBNAIL,
    ...column
}: Props) => {
    return (
        <Row fullWidth>
            {posts && posts.length
                ? posts.map((post: T_ArchivePost, index: number) => {
                      const tags = post.archives
                          ? post.archives.filter(
                                (term) => term.type === ARCHIVE.TAG,
                            )
                          : []
                      return (
                          <Column
                              key={`card-${keyPrefix}-${index}-${post.id}`}
                              {...column}
                          >
                              <Card
                                  title={post.title}
                                  description={post.excerpt}
                                  to={post.link}
                                  time={post.date}
                                  image={getThumbnailFromPost(post, imageSize)}
                              >
                                  <Tags items={tags} />
                              </Card>
                          </Column>
                      )
                  })
                : null}
        </Row>
    )
}
