'use client'
import Image from 'next/image'
import { useRef, useState } from 'react'
/* Components */
import { WidgetTitle } from '../../_components/WidgetTitle'
import Card from '@app/archive/_components/Card'
import { Tags } from '@app/blog/_components/Tags'
/* CONSTANTS */
import { ARCHIVE } from '@common/constants'
import { TAILWIND_CARD_IMAGE } from '@app/_lib/constants'
/* Utils */
import useIntersectionObserver from '@app/_lib/hooks/useIntersectionObserver'
import { useServerAction } from '@app/_lib/hooks/useServerAction'
import { getRelated } from '@app/blog/_lib/getRelated'
import { map } from '@common/utils/array'
/* T_Type */
import type { T_ArchivePost } from '@common/types'

type Props = {
    slug: string
}

export const RelatedPosts = ({ slug }: Props) => {
    const ref = useRef(null)
    const [skip, setSkip] = useState(true)
    const { loading, error, data } = useServerAction(async () => await getRelated(slug), skip)
    useIntersectionObserver(ref, async () => {
        setSkip(false)
    })

    if (error) {
        return
    }

    return (
        <section aria-label="Related Posts" ref={ref} className="mt-5">
            <WidgetTitle>Related Posts</WidgetTitle>

            <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {(loading || !data || !data.length) &&
                    map(4, (_, index) => (
                        <li
                            key={`related-loading-${index}`}
                            className="bg-slate-500 aspect-video mb-4 animate-pulse"
                        ></li>
                    ))}
                {data
                    ? data.map((post: T_ArchivePost, index: number) => {
                          const tags = post.archives ? post.archives.filter((term) => term.type === ARCHIVE.TAG) : []
                          const url = post.images && (post.images.list?.url || post.images.thumbnail?.url)
                          const image = (
                              <Image
                                  src={url || '/assets/thumbnail.png'}
                                  alt={post.title}
                                  loading="lazy"
                                  width={400}
                                  height={300}
                                  className={TAILWIND_CARD_IMAGE}
                              />
                          )

                          return (
                              <Card
                                  key={`card-related-${index}-${post._id}`}
                                  title={post.title}
                                  description={post.excerpt}
                                  to={post.link}
                                  timestamp={post.date}
                                  ratio="aspect-video"
                                  image={image}
                              >
                                  <Tags items={tags} />
                              </Card>
                          )
                      })
                    : ''}
            </ul>
        </section>
    )
}
