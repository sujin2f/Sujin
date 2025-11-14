'use client'
import { use } from 'react'
/* Components */
import { WidgetTitle } from '@lib/components/WidgetTitle'
import { Cards } from '@lib/components/archive/Cards'
/* CONSTANTS */
import { IMAGE_SIZE, T_ArchivePost } from '@sujin/lib/types'
/* Assets */
import './RecentPosts.scss'

type Props = {
    promise: Promise<T_ArchivePost[]>
    id: number
}

export const RecentPosts = ({ promise, id }: Props) => {
    const items = use(promise)
    const posts = {
        list: items
            .filter((item) => item.id !== id)
            .slice(0, 4)
            .map((item) => ({
                ...item,
                date: new Date(parseInt(item.date.toString())),
            })),
        pages: 0,
    }

    return (
        <section className="recent-posts show-for-large">
            <WidgetTitle>Recent Posts</WidgetTitle>
            <Cards
                posts={posts}
                keyPrefix="recent"
                imageSize={IMAGE_SIZE.RECENT_POST}
            />
        </section>
    )
}
