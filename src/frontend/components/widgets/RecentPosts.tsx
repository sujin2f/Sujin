/** components/widgets/RecentPosts */
import React, { Fragment } from 'react'

import { SimplePost } from 'src/frontend/components/common/SimplePost'
import { useArchive } from 'src/frontend/store/hooks/archive'
import { SimplePost as SimplePostType } from 'src/frontend/store/items/simple-post'

interface Props {
    small: number
    medium: number
    large: number
}

export const RecentPosts = (props: Props): JSX.Element => {
    const archive = useArchive('recentPosts', 'recentPosts', 1, false)

    if (!archive || 'Success' !== archive.state) {
        return <Fragment />
    }

    return (
        <section className="widget recent-posts row">
            {archive.item &&
                archive.item.items &&
                archive.item.items.map((item: SimplePostType) => (
                    <SimplePost
                        key={`recent-post-id-${item.slug}`}
                        className={`column small-${props.small} medium-${props.medium} large-${props.large}`}
                        item={item}
                        thumbnailKey={{ desktop: 'small', mobile: 'small' }}
                    />
                ))}
        </section>
    )
}
