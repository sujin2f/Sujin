'use client'
import Image from 'next/image'
/* Components */
import { WidgetTitle } from '@app/_components/WidgetTitle'
import Card from '@app/archive/_components/Card'
/* Utils */
import { setRecent } from '@app/_store/slices/recent'
import { map } from '@sujin/share/utils/array'
import { useStoreOrAction } from '@app/_lib/hooks/useStoreOrAction'
import { getRecent } from '@app/blog/_lib/getRecent'
/* T_Types */
import type { T_ArchivePost } from '@sujin/lib/types'
/* CONSTANTS */
import { TAILWIND_CARD_IMAGE } from '@app/_lib/constants'
/* Assets */
import '@app/_lib/scss/recent-posts.scss'

type Props = {
    id: number
}

export const RecentPosts = ({ id }: Props) => {
    const { ref, loading, error, data: recent } = useStoreOrAction('recent', getRecent, setRecent)

    if (error) {
        return
    }

    const list = recent ? recent.filter((post) => post.id !== id).slice(0, 4) : []

    return (
        <section aria-label="Recent Posts" ref={ref}>
            <WidgetTitle>Recent Posts</WidgetTitle>

            <ul className="recent-posts grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-1">
                {(loading || !recent || !recent.length) &&
                    map(4, (_, index) => (
                        <li
                            key={`flickr-loading-${index}`}
                            className="bg-slate-500 aspect-square mb-4 animate-pulse"
                        ></li>
                    ))}
                {list.map((post: T_ArchivePost, index: number) => {
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
                            key={`card-recent-${index}-${post._id}`}
                            title={post.title}
                            description={post.excerpt}
                            to={post.link}
                            timestamp={post.date}
                            ratio="aspect-video"
                            image={image}
                        />
                    )
                })}
            </ul>
        </section>
    )
}
