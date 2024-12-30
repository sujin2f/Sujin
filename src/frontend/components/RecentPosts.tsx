/** components/widgets/RecentPosts */
import React, { Fragment } from 'react'
import { Card } from 'src/common/components/containers/Card'

import { useRecentPosts } from '../hooks/useRecentPosts'

type Props = {
    current: number
}

export const RecentPosts = (props: Props): JSX.Element => {
    const { recentPost } = useRecentPosts()

    if (!recentPost.length) {
        return <Fragment />
    }

    return (
        <section className="widget recent-posts show-for-large">
            {recentPost
                .filter((item) => item.id !== props.current)
                .slice(0, 4)
                .map((item) => (
                    <Card
                        key={`recent-post-id-${item.slug}`}
                        title={item.title}
                        description={item.excerpt}
                        to={item.link}
                        time={new Date(item.date)}
                        image={item.images.list || item.images.thumbnail}
                    />
                ))}
        </section>
    )
}
