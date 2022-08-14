/** components/widgets/RecentPosts */
import React, { Fragment } from 'react'

import { ListItem } from 'src/frontend/components/ListItem'
import { Post, TermTypes } from 'src/types/wordpress'
import { useArchive } from '../hooks/useArchive'

export const RecentPosts = (): JSX.Element => {
    const { archive, loading, error } = useArchive(
        TermTypes.recent_posts,
        '',
        0,
    )

    if (loading || error) {
        return <Fragment />
    }

    return (
        <section className="widget recent-posts show-for-large-only">
            {archive!.posts &&
                archive!.posts &&
                archive!.posts.map((item: Post) => (
                    <ListItem
                        key={`recent-post-id-${item.slug}`}
                        item={item}
                        thumbnailKey={{ desktop: 'small', mobile: 'small' }}
                    />
                ))}
        </section>
    )
}
