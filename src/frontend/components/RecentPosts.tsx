/** components/widgets/RecentPosts */
import React, { Fragment } from 'react'

import { ListItem } from 'src/frontend/components/ListItem'
import { Post } from 'src/types/wordpress'
import { useRecentPosts } from '../hooks/useRecentPosts'

export const RecentPosts = (): JSX.Element => {
    const { recentPost } = useRecentPosts()

    if (!recentPost.length) {
        return <Fragment />
    }

    return (
        <section className="widget recent-posts show-for-large">
            {recentPost.map((item: Post) => (
                <ListItem
                    key={`recent-post-id-${item.slug}`}
                    item={item}
                    thumbnailKey={{ desktop: 'small', mobile: 'small' }}
                />
            ))}
        </section>
    )
}
