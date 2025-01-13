import React from 'react'

import { Card } from '@common/components/containers/Card'
import { WidgetTitle } from '@src/components/WidgetTitle'
import { useRecentPost } from '@src/hooks/useRecentPost'

import '@src/scss/recent-post.scss'

type Props = {
    current: number
}

export const RecentPosts = (props: Props) => {
    const { recentPost } = useRecentPost()

    return (
        <section className="recent-posts show-for-large">
            <WidgetTitle>Recent Posts</WidgetTitle>
            {recentPost
                .filter((item) => item.id !== props.current)
                .slice(0, 4)
                .map((item) => (
                    <Card
                        key={`recent-post-id-${item.slug}`}
                        title={item.title}
                        description={item.excerpt}
                        to={item.link}
                        image={
                            item.images.list?.url ||
                            item.images.thumbnail?.url ||
                            '/thumbnail.png'
                        }
                    />
                ))}
        </section>
    )
}
