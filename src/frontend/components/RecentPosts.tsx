/** components/widgets/RecentPosts */
import React, { Fragment } from 'react'

import { ListItem } from 'src/frontend/components/ListItem'
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
                    <ListItem
                        key={`recent-post-id-${item.slug}`}
                        item={item}
                        thumbnailKey={{ desktop: 'small', mobile: 'small' }}
                    />
                ))}
        </section>
    )
}
