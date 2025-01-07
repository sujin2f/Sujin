import React, { Fragment } from 'react'

import { Card } from 'src/common/components/containers/Card'
import { WidgetTitle } from 'src/frontend/components/widget/WidgetTitle'
import { useRecentPosts } from 'src/frontend/hooks/useRecentPosts'
import DefaultThumbnail from 'src/frontend/images/thumbnail-default.png'

import 'src/frontend/scss/recent-post.scss'

type Props = {
    current: number
}

export const RecentPosts = (props: Props) => {
    const { recentPost } = useRecentPosts()

    if (!recentPost.length) {
        return <Fragment />
    }

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
                            DefaultThumbnail
                        }
                    />
                ))}
        </section>
    )
}
