'use client'
import Image from 'next/image'
import { useRef, useState } from 'react'
/* Components */
import { WidgetTitle } from '../WidgetTitle'
import Card from '@common/components/containers/Card'
import { Tags } from '@app/_components/single/Tags'
/* CONSTANTS */
import { ARCHIVE } from '@sujin/lib/constants'
/* Utils */
import useIntersectionObserver from '@common/hooks/useIntersectionObserver'
import { useServerAction } from '@app/_hooks/useServerAction'
/* T_Type */
import type { T_ArchivePost } from '@sujin/lib/types'

type Props = {
    readonly action: () => Promise<T_ArchivePost[]>
}

export const RelatedPosts = ({ action }: Props) => {
    const ref = useRef(null)
    const [skip, setSkip] = useState(true)
    // Read from GraphQL
    const { loading, error, data } = useServerAction(action, skip)
    useIntersectionObserver(ref, async () => {
        setSkip(false)
    })

    if (error || loading || !data) {
        return <div ref={ref} />
    }

    return (
        <section aria-label="Related Posts">
            <WidgetTitle>Related Posts</WidgetTitle>

            <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {data.map((post: T_ArchivePost, index: number) => {
                    const tags = post.archives ? post.archives.filter((term) => term.type === ARCHIVE.TAG) : []
                    const url = post.images && (post.images.list?.url || post.images.thumbnail?.url)
                    const picture = (
                        <Image
                            src={url || '/assets/thumbnail.png'}
                            alt={post.title}
                            loading="lazy"
                            width={400}
                            height={300}
                            className="w-full h-full object-cover object-center"
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
                            picture={picture}
                            image=""
                        >
                            <Tags items={tags} />
                        </Card>
                    )
                })}
            </ul>
        </section>
    )
}
