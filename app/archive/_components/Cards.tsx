import { use } from 'react'
/* Components */
import { Paging } from '@app/_components/Paging'
import Row from '@common/components/layout/Row'
import Column from '@common/components/layout/Column'
import Card from '@common/components/containers/Card'
import { Tags } from '@app/(single)/_components/Tags'
/* T_Types */
import type { ColumnProps } from '@common/components/layout/Column'
import {
    ARCHIVE,
    IMAGE_SIZE,
    type PropWithPages,
    type T_ArchivePost,
} from '@app/_lib/types'
/* Utils */
import { getThumbnailFromPost } from '@app/_lib/utils/clients'

type Props = ColumnProps & {
    readonly posts: Promise<PropWithPages<T_ArchivePost>>
    readonly keyPrefix: string
    readonly imageSize?: IMAGE_SIZE
    readonly page?: number
    readonly pageURLPrefix?: string
}

export const Cards = ({
    posts: postsPromise,
    page,
    pageURLPrefix,
    keyPrefix,
    imageSize = IMAGE_SIZE.POST_THUMBNAIL,
    ...props
}: Props) => {
    const { list, pages } = use(postsPromise)
    return (
        <>
            <Row fullWidth>
                {list && list.length
                    ? list.map((post: T_ArchivePost, index: number) => {
                          const tags = post.archives
                              ? post.archives.filter(
                                    (term) => term.type === ARCHIVE.TAG,
                                )
                              : []

                          return (
                              <Column
                                  key={`card-${keyPrefix}-${index}-${post._id}`}
                                  {...props}
                              >
                                  <Card
                                      title={post.title}
                                      description={post.excerpt}
                                      to={post.link}
                                      time={post.date}
                                      image={getThumbnailFromPost(
                                          post.images,
                                          imageSize,
                                      )}
                                  >
                                      <Tags items={tags} />
                                  </Card>
                              </Column>
                          )
                      })
                    : null}
            </Row>

            {/* <Cards posts={list} {...props} /> */}
            {page && pageURLPrefix ? (
                <Paging pages={pages} page={page} urlPrefix={pageURLPrefix} />
            ) : null}
        </>
    )
}
